const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib


function getFieldData() {
    const fields = [
        "facilityName", "providerName", "fullName", "dateOfBirth", "telephoneNumber",
        "allRecords", "officeNotes", "operativeReports", "images", "labResults",
        "radiologyReports", "previousRecords", "email", "fax", "mail"
    ];

    const fieldData = {};

    fields.forEach(field => {
        const element = document.getElementById(field);
        fieldData[field] = element.type === "checkbox" ? element.checked : element.value;
    });

    return fieldData;
}


async function modifyPdf() {

    // Fetch the field data from the form
    const fieldData = getFieldData();
    console.log(fieldData);

    // Fetch an existing PDF document
    const url = 'https://pdf-lib.js.org/assets/with_update_sections.pdf';
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Capture the signature from the canvas
    const canvas = document.getElementById("signature-pad");
    const signatureDataUrl = canvas.toDataURL("image/png"); // Get the signature as a PNG

    // Convert the base64 image into a format pdf-lib can use
    const base64Response = await fetch(signatureDataUrl);
    const signatureImageBytes = await base64Response.arrayBuffer();
    const signatureImage = await pdfDoc.embedPng(signatureImageBytes);

    // Define position and size for the signature
    const signatureWidth = 200; // Adjust as needed
    const signatureHeight = 100; // Adjust as needed
    const x = 100; // Adjust as needed
    const y = 350; // Adjust as needed

    // Draw the signature on the PDF
    firstPage.drawImage(signatureImage, {
        x,
        y,
        width: signatureWidth,
        height: signatureHeight,
    });

    // Draw a string of text diagonally across the first page
    firstPage.drawText(fieldData.fullName, {
        x: 150,
        y: 125,
        size: 12,
        color: rgb(0.95, 0.1, 0.1),
        })

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Trigger the browser to download the PDF document
    download(pdfBytes, "pdf-lib_modification_example.pdf", "application/pdf");
}
