"use client"

interface Transaction {
  invoiceReference: string
  date: string
  amount: number
  status: "Paid" | "Pending"
}

interface VendorDetailsTransactionsProps {
  vendorId: string
}

const transactionsData: Record<string, Transaction[]> = {
  "76567": [
    {
      invoiceReference: "1070000137",
      date: "Shawwal 22, 1441\n14 June 2020",
      amount: 10000,
      status: "Paid",
    },
    {
      invoiceReference: "0005000068",
      date: "Dhul Qadah 7, 1441\n28 June 2020",
      amount: 10000,
      status: "Paid",
    },
    {
      invoiceReference: "1070000136",
      date: "Muharram 5, 1441\n24 August 2020",
      amount: 10000,
      status: "Paid",
    },
    {
      invoiceReference: "0005000069",
      date: "Rabi Al-Awwal 29, 1442\n15 Nov 2020",
      amount: 10000,
      status: "Pending",
    },
  ],
}

export default function VendorDetailsTransactions({ vendorId }: VendorDetailsTransactionsProps) {
  const transactions = transactionsData[vendorId] || transactionsData["76567"]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Invoices</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Invoice reference</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Invoice reference</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, idx) => (
              <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{transaction.invoiceReference}</td>
                <td className="px-6 py-4 text-sm text-gray-600 whitespace-pre-line">{transaction.date}</td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {transaction.amount.toLocaleString()}.00
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      transaction.status === "Paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
