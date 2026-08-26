import { jsPDF } from "jspdf";
import { HistoryItem } from "../types";

export interface SingleAuditReportData {
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  factorLabel: string;
  emissions: number;
  treeOffset: number;
  status: "low" | "moderate" | "high";
  advice: string[];
  timestamp: string;
}

export function generateCarbonAuditReport(data: SingleAuditReportData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const primaryColor = [46, 164, 79]; // #2ea44f
  const darkColor = [22, 27, 34];    // #161b22
  const grayColor = [100, 110, 120];

  // Header Banner
  doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.rect(0, 0, 210, 35, "F");

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("EcoPulse Vision", 15, 18);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(180, 190, 200);
  doc.text("UN SDG 13: CLIMATE ACTION - INDIVIDUAL CARBON AUDIT CERTIFICATE", 15, 25);

  // Timestamp
  doc.setFontSize(8);
  doc.text(`Generated: ${data.timestamp}`, 195, 18, { align: "right" });
  doc.text(`Protocol: GHG Scope 1-3`, 195, 24, { align: "right" });

  // Dividing line
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(1);
  doc.line(0, 35, 210, 35);

  let currentY = 48;

  // Item Profile
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text("Audited Object & Lifecycle Parameters", 15, currentY);

  currentY += 8;
  doc.setFillColor(245, 248, 245);
  doc.rect(15, currentY, 180, 24, "F");
  doc.setDrawColor(220, 230, 220);
  doc.rect(15, currentY, 180, 24, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text(`Item: ${data.itemName}`, 20, currentY + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text(`Category: ${data.category.toUpperCase()}   |   Duration / Distance: ${data.quantity} ${data.unit}`, 20, currentY + 14);
  doc.text(`Emissions Coefficient: ${data.factorLabel}`, 20, currentY + 20);

  // KPI Metrics Section
  currentY += 34;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text("Carbon Output & Botanical Mitigation", 15, currentY);

  currentY += 8;
  // Emissions Card
  doc.setFillColor(240, 244, 241);
  doc.rect(15, currentY, 85, 28, "F");
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.rect(15, currentY, 85, 28, "S");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text("TOTAL EMISSIONS GENERATED", 20, currentY + 8);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text(`${data.emissions.toFixed(2)} kg CO2`, 20, currentY + 20);

  // Tree Offset Card
  doc.setFillColor(240, 244, 241);
  doc.rect(110, currentY, 85, 28, "F");
  doc.rect(110, currentY, 85, 28, "S");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text("BOTANICAL OFFSET REQUIREMENT", 115, currentY + 8);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`${data.treeOffset} Tree${data.treeOffset === 1 ? "" : "s"} / Year`, 115, currentY + 20);

  // Tailored AI Mitigation Advice
  currentY += 40;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text("Tailored AI Mitigation & Reduction Steps", 15, currentY);

  currentY += 6;
  doc.setFillColor(250, 252, 250);
  doc.rect(15, currentY, 180, 45, "F");
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.rect(15, currentY, 180, 45, "S");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);

  let tipY = currentY + 8;
  data.advice.forEach((tip, idx) => {
    const lines = doc.splitTextToSize(`${idx + 1}. ${tip}`, 168);
    doc.text(lines, 20, tipY);
    tipY += (lines.length * 5) + 3;
  });

  // Footer
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text("Certified by EcoPulse Multimodal Vision Intelligence under UN SDG 13 Climate Action frameworks.", 105, 285, { align: "center" });

  doc.save(`EcoPulse-Audit-${data.itemName.replace(/\s+/g, "_")}.pdf`);
}

export function generatePDFReport(history: HistoryItem[], userName: string) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const cumulativeCarbon = history.reduce((sum, item) => sum + item.emissions, 0);
  const totalTrees = history.reduce((sum, item) => sum + item.treeOffset, 0);

  const primaryColor = [46, 164, 79];
  const darkColor = [22, 27, 34];
  const grayColor = [100, 110, 120];
  const bgLight = [245, 248, 245];

  // Header Banner
  doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.rect(0, 0, 210, 35, "F");

  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(15, 10, 8, 8, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("EcoPulse Vision", 28, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(180, 190, 200);
  doc.text("UN SDG 13: CLIMATE ACTION - PERSONAL CARBON AUDIT REPORT", 28, 22);

  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 195, 15, { align: "right" });
  doc.text(`Auditor: ${userName}`, 195, 20, { align: "right" });

  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(1);
  doc.line(0, 35, 210, 35);

  let currentY = 48;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text("Executive Carbon Footprint Summary", 15, currentY);

  currentY += 6;
  doc.setFillColor(240, 244, 241);
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

  doc.setFillColor(240, 244, 241);
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

  // Table Section
  currentY += 38;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text("Audited Sessions & Snapshots", 15, currentY);

  currentY += 5;
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

  history.forEach((item, index) => {
    if (currentY > 265) {
      doc.addPage();
      currentY = 20;
      
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

    if (index % 2 === 0) {
      doc.setFillColor(248, 249, 250);
    } else {
      doc.setFillColor(255, 255, 255);
    }
    doc.rect(15, currentY, 180, 8, "F");

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

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text("This report was generated by EcoPulse Vision, supporting UN Sustainable Development Goal 13: Climate Action.", 105, 285, { align: "center" });

  doc.save(`EcoPulse-Carbon-Audit-Report-${new Date().toISOString().slice(0,10)}.pdf`);
}
