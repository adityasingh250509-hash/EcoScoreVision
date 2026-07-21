import { jsPDF } from "jspdf";
import { HistoryItem } from "../types";

export function generatePDFReport(history: HistoryItem[], userName: string) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const cumulativeCarbon = history.reduce((sum, item) => sum + item.emissions, 0);
  const totalTrees = history.reduce((sum, item) => sum + item.treeOffset, 0);

  // Colors
  const primaryColor = [46, 164, 79]; // Eco Green #2ea44f
  const darkColor = [22, 27, 34];    // Dark Slate #161b22
  const grayColor = [100, 110, 120];  // Slate gray
  const bgLight = [245, 248, 245];   // Very soft green tint

  // Header Banner
  doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.rect(0, 0, 210, 35, "F");

  // EcoPulse logo / icon
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(15, 10, 8, 8, "F");
  
  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("EcoPulse Vision", 28, 16);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(180, 190, 200);
  doc.text("UN SDG 13: CLIMATE ACTION - PERSONAL CARBON AUDIT REPORT", 28, 22);

  // Document Info (Right aligned in header)
  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 195, 15, { align: "right" });
  doc.text(`Auditor: ${userName}`, 195, 20, { align: "right" });

  // Draw dividing line
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(1);
  doc.line(0, 35, 210, 35);

  // ------------------ Summary Cards / KPI Block ------------------
  let currentY = 48;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text("Executive Carbon Footprint Summary", 15, currentY);

  currentY += 6;
  // Card 1: Total Carbon Footprint
  doc.setFillColor(240, 244, 241); // light sage
  doc.rect(15, currentY, 85, 25, "F");
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.rect(15, currentY, 85, 25, "S");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text("TOTAL CARBON FOOTPRINT", 20, currentY + 7);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text(`${cumulativeCarbon.toFixed(1)} kg CO2`, 20, currentY + 18);

  // Card 2: Tree Offset Target
  doc.setFillColor(240, 244, 241); // light sage
  doc.rect(110, currentY, 85, 25, "F");
  doc.rect(110, currentY, 85, 25, "S");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text("ANNUAL TREE OFFSET TARGET", 115, currentY + 7);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`${totalTrees} Tree${totalTrees === 1 ? "" : "s"} Required`, 115, currentY + 18);

  // ------------------ Table Section ------------------
  currentY += 38;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text("Audited Sessions & Snapshots", 15, currentY);

  currentY += 5;
  // Table Header
  doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.rect(15, currentY, 180, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text("Timestamp", 18, currentY + 5.5);
  doc.text("Audited Item / Category", 55, currentY + 5.5);
  doc.text("Measured Qty", 115, currentY + 5.5);
  doc.text("Emissions (kg)", 150, currentY + 5.5);
  doc.text("Offset (Trees)", 175, currentY + 5.5);

  currentY += 8;

  // Rows
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);

  history.forEach((item, index) => {
    // Check page overflow
    if (currentY > 265) {
      doc.addPage();
      currentY = 20;
      
      // Reprint header on new page
      doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.rect(15, currentY, 180, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(255, 255, 255);
      doc.text("Timestamp", 18, currentY + 5.5);
      doc.text("Audited Item / Category", 55, currentY + 5.5);
      doc.text("Measured Qty", 115, currentY + 5.5);
      doc.text("Emissions (kg)", 150, currentY + 5.5);
      doc.text("Offset (Trees)", 175, currentY + 5.5);
      currentY += 8;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    }

    // Alternating background colors
    if (index % 2 === 0) {
      doc.setFillColor(248, 249, 250);
    } else {
      doc.setFillColor(255, 255, 255);
    }
    doc.rect(15, currentY, 180, 8, "F");

    // Border line below each row
    doc.setDrawColor(230, 235, 240);
    doc.setLineWidth(0.1);
    doc.line(15, currentY + 8, 195, currentY + 8);

    doc.setFont("helvetica", "normal");
    doc.text(item.timestamp || "N/A", 18, currentY + 5.5);
    doc.setFont("helvetica", "bold");
    doc.text(item.item_name, 55, currentY + 5.5);
    doc.setFont("helvetica", "normal");
    doc.text(`(${item.category.toUpperCase()})`, 90, currentY + 5.5);
    doc.text(`${item.quantity} ${item.unit}`, 115, currentY + 5.5);
    doc.text(`${item.emissions.toFixed(2)} kg CO2`, 150, currentY + 5.5);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`${item.treeOffset} tree${item.treeOffset === 1 ? "" : "s"}`, 175, currentY + 5.5);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);

    currentY += 8;
  });

  // ------------------ Actions & Guidelines Section ------------------
  currentY += 12;
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.rect(15, currentY, 180, 26, "F");
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.rect(15, currentY, 180, 26, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("UN SDG 13 Climate Action Guidelines & Recommendations:", 20, currentY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text("1. Reduce energy use by turning off unused appliances and transitioning to high-efficiency LED bulbs.", 20, currentY + 11);
  doc.text("2. Lower transport emissions by choosing carpooling, biking, public transit, or electric vehicle alternatives.", 20, currentY + 16);
  doc.text("3. Support global reforestation efforts: planting trees directly counteracts and absorbs ongoing industrial CO2 emissions.", 20, currentY + 21);

  // Footer text
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text("This report was generated by EcoPulse Vision, supporting UN Sustainable Development Goal 13: Climate Action.", 105, 285, { align: "center" });

  doc.save(`EcoPulse-Carbon-Audit-Report-${new Date().toISOString().slice(0,10)}.pdf`);
}
