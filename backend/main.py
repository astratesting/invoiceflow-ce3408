"""
InvoiceFlow FastAPI Backend
Provides additional API endpoints for external integrations.
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
    allow_origins=["http://localhost:3000", "https://invoiceflow.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SQLite database path
DB_PATH = os.getenv("DATABASE_URL", "file:./dev.db").replace("file:", "")


# Models
class InvoiceResponse(BaseModel):
    id: str
    number: str
    status: str
    issueDate: datetime
    dueDate: datetime
    total: float
    clientName: str
    clientEmail: str


class ClientResponse(BaseModel):
    id: str
    name: str
    email: str
    company: Optional[str]
    invoiceCount: int
    totalBilled: float


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


@app.get("/api/invoices", response_model=List[InvoiceResponse])
async def list_invoices(
    status: Optional[str] = None,
    db: sqlite3.Connection = Depends(get_db)
):
    """List all invoices, optionally filtered by status."""
    query = """
        SELECT i.id, i.number, i.status, i.issueDate, i.dueDate, i.total,
               c.name as clientName, c.email as clientEmail
        FROM Invoice i
        JOIN Client c ON i.clientId = c.id
    """
    params = []
    if status:
        query += " WHERE i.status = ?"
        params.append(status)

    query += " ORDER BY i.createdAt DESC"

    cursor = db.execute(query, params)
    rows = cursor.fetchall()

    return [dict(row) for row in rows]


@app.get("/api/invoices/{invoice_id}")
async def get_invoice(invoice_id: str, db: sqlite3.Connection = Depends(get_db)):
    """Get a specific invoice with all details."""
    cursor = db.execute("""
        SELECT i.*, c.name as clientName, c.email as clientEmail,
               c.company, c.phone, c.address
        FROM Invoice i
        JOIN Client c ON i.clientId = c.id
        WHERE i.id = ?
    """, (invoice_id,))

    invoice = cursor.fetchone()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    # Get line items
    items_cursor = db.execute("""
        SELECT * FROM InvoiceItem
        WHERE invoiceId = ?
        ORDER BY "order" ASC
    """, (invoice_id,))

    items = [dict(row) for row in items_cursor.fetchall()]

    result = dict(invoice)
    result["items"] = items

    return result


@app.get("/api/clients", response_model=List[ClientResponse])
async def list_clients(db: sqlite3.Connection = Depends(get_db)):
    """List all clients with their invoice summary."""
    cursor = db.execute("""
        SELECT c.*,
               COUNT(i.id) as invoiceCount,
               COALESCE(SUM(i.total), 0) as totalBilled
        FROM Client c
        LEFT JOIN Invoice i ON c.id = i.clientId
        GROUP BY c.id
        ORDER BY c.createdAt DESC
    """)

    rows = cursor.fetchall()
    return [dict(row) for row in rows]


@app.get("/api/clients/{client_id}")
async def get_client(client_id: str, db: sqlite3.Connection = Depends(get_db)):
    """Get a specific client with all their invoices."""
    cursor = db.execute("SELECT * FROM Client WHERE id = ?", (client_id,))
    client = cursor.fetchone()

    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    # Get client invoices
    invoices_cursor = db.execute("""
        SELECT * FROM Invoice
        WHERE clientId = ?
        ORDER BY createdAt DESC
    """, (client_id,))

    invoices = [dict(row) for row in invoices_cursor.fetchall()]

    result = dict(client)
    result["invoices"] = invoices

    return result


@app.get("/api/stats")
async def get_stats(db: sqlite3.Connection = Depends(get_db)):
    """Get invoice statistics."""
    # Total revenue
    total_cursor = db.execute("SELECT COALESCE(SUM(total), 0) as total FROM Invoice")
    total = total_cursor.fetchone()["total"]

    # By status
    status_cursor = db.execute("""
        SELECT status, COUNT(*) as count, COALESCE(SUM(total), 0) as amount
        FROM Invoice
        GROUP BY status
    """)
    by_status = {row["status"]: {"count": row["count"], "amount": row["amount"]}
                  for row in status_cursor.fetchall()}

    # Invoice count
    count_cursor = db.execute("SELECT COUNT(*) as count FROM Invoice")
    count = count_cursor.fetchone()["count"]

    # Client count
    client_cursor = db.execute("SELECT COUNT(*) as count FROM Client")
    client_count = client_cursor.fetchone()["count"]

    return {
        "totalRevenue": total,
        "invoiceCount": count,
        "clientCount": client_count,
        "byStatus": by_status
    }


@app.post("/api/payments/{invoice_id}")
async def record_payment(
    invoice_id: str,
    amount: float,
    payment_date: Optional[str] = None,
    db: sqlite3.Connection = Depends(get_db)
):
    """Record a payment for an invoice."""
    cursor = db.execute("SELECT * FROM Invoice WHERE id = ?", (invoice_id,))
    invoice = cursor.fetchone()

    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    paid_date = payment_date or datetime.utcnow().isoformat()

    db.execute("""
        UPDATE Invoice
        SET status = 'PAID', paidDate = ?, updatedAt = ?
        WHERE id = ?
    """, (paid_date, datetime.utcnow().isoformat(), invoice_id))
    db.commit()

    return {"message": "Payment recorded", "invoiceId": invoice_id, "status": "PAID"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
