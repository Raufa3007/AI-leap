export async function downloadPOAsPDF(poData: any) {
  try {
    // Create a new window for printing
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("Please allow pop-ups to download the PO")
      return
    }

    // Generate HTML content for the PO
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Purchase Order - ${poData.id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #1b7a3a;
              padding-bottom: 20px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #1b7a3a;
            }
            .po-title {
              text-align: right;
            }
            .po-title h1 {
              margin: 0;
              font-size: 20px;
              color: #1b7a3a;
            }
            .po-title p {
              margin: 5px 0 0 0;
              color: #666;
            }
            .details-grid {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
            }
            .detail-item {
              border: 1px solid #ddd;
              padding: 15px;
              border-radius: 4px;
            }
            .detail-label {
              font-size: 12px;
              color: #666;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .detail-value {
              font-size: 14px;
              color: #333;
              font-weight: 500;
            }
            .section-title {
              font-size: 16px;
              font-weight: bold;
              color: #1b7a3a;
              margin-top: 30px;
              margin-bottom: 15px;
              border-bottom: 1px solid #ddd;
              padding-bottom: 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th {
              background-color: #1b7a3a;
              color: white;
              padding: 12px;
              text-align: left;
              font-size: 12px;
              font-weight: bold;
            }
            td {
              padding: 12px;
              border-bottom: 1px solid #ddd;
              font-size: 13px;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .vendor-section {
              display: flex;
              gap: 30px;
              margin-bottom: 30px;
            }
            .vendor-info {
              flex: 1;
            }
            .vendor-logo {
              width: 120px;
              height: 120px;
              border: 1px solid #ddd;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 4px;
            }
            .vendor-logo img {
              max-width: 100px;
              max-height: 100px;
            }
            .total-row {
              font-weight: bold;
              background-color: #f0f0f0;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
            @media print {
              body {
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">KAAR TECH</div>
            <div class="po-title">
              <h1>Purchase Order</h1>
              <p>${poData.id}</p>
            </div>
          </div>

          <div class="details-grid">
            <div class="detail-item">
              <div class="detail-label">PO Number</div>
              <div class="detail-value">${poData.poNumber}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">PR Number</div>
              <div class="detail-value">${poData.prNumber}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">RFP Number</div>
              <div class="detail-value">${poData.rfpNumber}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Status</div>
              <div class="detail-value">${poData.status}</div>
            </div>
          </div>

          <div class="details-grid">
            <div class="detail-item">
              <div class="detail-label">PO Issued Date</div>
              <div class="detail-value">${poData.poIssuedDate}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Expected Delivery Date</div>
              <div class="detail-value">${poData.expectedDeliveryDate}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Department</div>
              <div class="detail-value">${poData.department}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Total PO Value</div>
              <div class="detail-value">${poData.totalPOValue}</div>
            </div>
          </div>

          <div class="section-title">Vendor Information</div>
          <div class="vendor-section">
            <div class="vendor-info">
              <h3 style="margin: 0 0 15px 0; color: #1b7a3a;">${poData.vendor.name}</h3>
              <div class="detail-item">
                <div class="detail-label">Email</div>
                <div class="detail-value">${poData.vendor.email}</div>
              </div>
              <div class="detail-item" style="margin-top: 10px;">
                <div class="detail-label">Contact</div>
                <div class="detail-value">${poData.vendor.contact}</div>
              </div>
              <div class="detail-item" style="margin-top: 10px;">
                <div class="detail-label">PO Value</div>
                <div class="detail-value">${poData.vendor.poValue}</div>
              </div>
            </div>
            <div class="vendor-logo">
              <img src="${poData.vendor.logo}" alt="${poData.vendor.name}" />
            </div>
          </div>

          <div class="section-title">Goods Information</div>
          <table>
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Unit Price</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              ${poData.goods
                .map(
                  (item: any) => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>${item.unit}</td>
                  <td>${item.unitPrice}</td>
                  <td>${item.totalPrice}</td>
                </tr>
              `,
                )
                .join("")}
              <tr class="total-row">
                <td colspan="4" style="text-align: right;">Total Cost:</td>
                <td>${poData.totalCost}</td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            <p>This is an electronically generated document. No signature is required.</p>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
        </body>
      </html>
    `

    // Write content to the new window
    printWindow.document.write(htmlContent)
    printWindow.document.close()

    // Trigger print dialog which allows saving as PDF
    setTimeout(() => {
      printWindow.print()
    }, 250)
  } catch (error) {
    console.error("[v0] Error downloading PO:", error)
    alert("Failed to download PO. Please try again.")
  }
}
