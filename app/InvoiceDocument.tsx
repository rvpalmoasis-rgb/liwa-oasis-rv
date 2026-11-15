import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20, borderBottomWidth: 1, borderBottomColor: "#166534", paddingBottom: 10 },
  title: { fontSize: 20, color: "#166534", fontWeight: "bold" },
  companyInfo: { textAlign: "right", fontSize: 9, color: "#4b5563" },
  section: { marginVertical: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  label: { fontWeight: "bold", color: "#374151" },
  tableHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#d1d5db", paddingBottom: 5, marginBottom: 5, fontWeight: "bold" },
  tableRow: { flexDirection: "row", paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  col1: { width: "60%" },
  col2: { width: "20%", textAlign: "right" },
  col3: { width: "20%", textAlign: "right" },
  totalRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#d1d5db" },
  totalLabel: { width: "40%", textAlign: "right", fontWeight: "bold", paddingRight: 10 },
  totalValue: { width: "20%", textAlign: "right", fontWeight: "bold", color: "#166534" },
  footer: { position: "absolute", bottom: 40, left: 40, right: 40, textAlign: "center", color: "#9ca3af", fontSize: 8, borderTopWidth: 1, borderTopColor: "#f3f4f6", paddingTop: 10 }
});

export default function InvoiceDocument({ booking }: { booking: any }) {
  const nights = Math.max(1, (new Date(booking.depart).getTime() - new Date(booking.arrive).getTime()) / (1000 * 3600 * 24));
  const rate = (booking.price_aed / nights).toFixed(2);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>LIWA OASIS RV CAMP</Text>
            <Text style={{ marginTop: 5, color: "#4b5563" }}>Tax Invoice / Receipt</Text>
          </View>
          <View style={styles.companyInfo}>
            <Text>Liwa Oasis RV Camp</Text>
            <Text>Liwa City, Abu Dhabi, UAE</Text>
            <Text>Tel: 050 7318762</Text>
            <Text>rvpalmoasis@gmail.com</Text>
          </View>
        </View>

        {/* Booking Details */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 15, backgroundColor: "#f9fafb", padding: 10, borderRadius: 5 }}>
          <View>
            <Text style={styles.label}>Billed To:</Text>
            <Text>{booking.guests?.name}</Text>
            <Text>{booking.guests?.phone}</Text>
          </View>
          <View style={{ textAlign: "right" }}>
            <Text style={styles.label}>Invoice Reference:</Text>
            <Text>{booking.ref}</Text>
            <Text style={{ marginTop: 5 }}><Text style={styles.label}>Issue Date: </Text>{new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Line Items */}
        <View style={styles.section}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Description</Text>
            <Text style={styles.col2}>Nights</Text>
            <Text style={styles.col3}>Amount (AED)</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.col1}>RV Full-Service Pitch - Spot {booking.spot_code}</Text>
            <Text style={styles.col2}>{nights}</Text>
            <Text style={styles.col3}>{booking.price_aed.toFixed(2)}</Text>
          </View>
        </View>

        {/* Totals */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total (AED):</Text>
          <Text style={styles.totalValue}>{booking.price_aed.toFixed(2)}</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 5 }}>
          <Text style={{ width: "40%", textAlign: "right", fontWeight: "bold", paddingRight: 10 }}>Paid Status:</Text>
          <Text style={{ width: "20%", textAlign: "right", fontWeight: "bold", color: booking.paid_aed >= booking.price_aed ? "#166534" : "#b91c1c" }}>
            {booking.paid_aed >= booking.price_aed ? "PAID IN FULL" : `UNPAID (Due: ${(booking.price_aed - booking.paid_aed).toFixed(2)} AED)`}
          </Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Cancellation Policy: No refund will be issued for cancellations made one day (24 hours) or less before the arrival date.{"\n"}
          Thank you for choosing Liwa Oasis RV Camp. We hope you enjoy your stay!
        </Text>
      </Page>
    </Document>
  );
}