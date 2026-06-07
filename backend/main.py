"""
InvoiceFlow FastAPI Backend
Provides REST API for invoice and client management with SQLite.
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import sqlite3
import os

app = FastAPI(
    title="InvoiceFlow API",
    description="InvoiceFlow - Calm Invoicing for Small Businesses",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SQLite database path
DB_PATH = os.getenv("DATABASE_URL", "file:./dev.db").replace("file:", "")


# Models
class InvoiceItemModel(BaseModel):
    name: str
    description: Optional[str] = None
    quantity: float
    rate: float
    amount: float


class InvoiceCreate(BaseModel):
    number: str
    clientId: str
    dueDate: str
    notes: Optional[str] = None
    taxRate: float = 0
    subtotal: float
    taxAmount: float
    total: float
    items: List[InvoiceItemModel]
    status: str = "DRAFT"


class ClientCreate(BaseModel):
    name: str
    email: str
    company: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None


# Database helper
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


@app.get("/")
async def root():
    return {
        "name": "InvoiceFlow API",
        "version": "1.0.0",
        "description": "Calm invoicing for small businesses"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}


@app.get("/api/invoices")
async def list_invoices(
    status: Optional[str] = None,
    db: sqlite3.Connection = Depends(get_db)
):
    query = """
        SELECT i.id, i.number, i.status, i.issueDate, i.dueDate, i.total,
               c.name as clientName, c.email as clientEmail
        FROM invoices i
        JOIN clients c ON i.clientId = c.id
    """
    params = []
    if status:
        query += " WHERE i.status = ?"
        params.append(status)

    cursor = db.execute(query, params)
    rows = cursor.fetchall()
    return [dict(row) for row in rows]


@app.get("/api/invoices/{invoice_id}")
async def get_invoice(invoice_id: str, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.execute(
        """SELECT i.*, c.name as clientName, c.email as clientEmail,
                  c.company, c.phone, c.address
           FROM invoices i
           JOIN clients c ON i.clientId = c.id
           WHERE i.id = ?""",
        (invoice_id,)
    )
    invoice = cursor.fetchone()

    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    cursor = db.execute(
        "SELECT * FROM invoice_items WHERE invoiceId = ? ORDER BY `order`",
        (invoice_id,)
    )
    items = [dict(row) for row in cursor.fetchall()]

    return {**dict(invoice), "items": items}


@app.post("/api/invoices", status_code=status.HTTP_201_CREATED)
async def create_invoice(invoice: InvoiceCreate, db: sqlite3.Connection = Depends(get_db)):
    try:
        cursor = db.execute(
            """INSERT INTO invoices
               (id, number, status, issueDate, dueDate, subtotal, taxRate, taxAmount, total, notes, userId, clientId)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                invoice.number,
                invoice.number,
                invoice.status,
                datetime.utcnow().isoformat(),
                invoice.dueDate,
                invoice.subtotal,
                invoice.taxRate,
                invoice.taxAmount,
                invoice.total,
                invoice.notes,
                "backend-user",
                invoice.clientId,
            )
        )
        invoice_id = cursor.lastrowid

        for idx, item in enumerate(invoice.items):
            db.execute(
                """INSERT INTO invoice_items (id, name, description, quantity, rate, amount, `order`, invoiceId)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    f"{invoice.number}-{idx}",
                    item.name,
                    item.description,
                    item.quantity,
                    item.rate,
                    item.amount,
                    idx,
                    invoice.number,
                )
            )

        db.commit()
        return {"id": invoice.number, "number": invoice.number}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@app.put("/api/invoices/{invoice_id}")
async def update_invoice_status(
    invoice_id: str,
    new_status: str,
    db: sqlite3.Connection = Depends(get_db)
):
    db.execute("UPDATE invoices SET status = ? WHERE id = ?", (new_status, invoice_id))
    db.commit()
    return {"status": "updated"}


@app.get("/api/clients")
async def list_clients(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.execute("SELECT * FROM clients")
    clients = cursor.fetchall()

    result = []
    for client in clients:
        cursor = db.execute(
            "SELECT COUNT(*) as cnt, SUM(total) as total FROM invoices WHERE clientId = ?",
            (client["id"],)
        )
        stats = cursor.fetchone()
        result.append({
            **dict(client),
            "invoiceCount": stats["cnt"] or 0,
            "totalBilled": stats["total"] or 0,
        })

    return result


@app.post("/api/clients", status_code=status.HTTP_201_CREATED)
async def create_client(client: ClientCreate, db: sqlite3.Connection = Depends(get_db)):
    try:
        db.execute(
            """INSERT INTO clients (id, name, email, company, phone, address)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (
                f"client-{datetime.utcnow().timestamp()}",
                client.name,
                client.email,
                client.company,
                client.phone,
                client.address,
            )
        )
        db.commit()
        return {"status": "created"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
