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

    // Fetch an existing PDF document
    const path = 'assets/Forms/OrthoArkansas_Authorization_Medical_Records.pdf';
    const existingPdfBytes = await fetch(path).then(res => res.arrayBuffer());

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

    // Draw Facility Name on the PDF'
    firstPage.drawText(fieldData.facilityName, {
        x: 130,
        y: 575,
        size: 12,
        color: rgb(0.95, 0.1, 0.1),
    })

    // // Draw Provider Name on the PDF
    // firstPage.drawText(fieldData.providerName, {
    //     x: 330,
    //     y: 575,
    //     size: 12,
    // })

    // // Draw Full Name on the PDF
    // firstPage.drawText(fieldData.fullName, {
    //     x: 125,
    //     y: 500,
    //     size: 12,
    // })

    // // Draw Date of Birth on the PDF
    // firstPage.drawText(fieldData.dateOfBirth, {
    //     x: 250,
    //     y: 500,
    //     size: 12,
    // })
    
    // // Draw Telephone Number on the PDF
    // firstPage.drawText(fieldData.telephoneNumber, {
    //     x: 125,
    //     y: 400,
    //     size: 12,
    // })

    // // Draw the signature on the PDF
    // firstPage.drawImage(signatureImage, {
    //     x: 100,
    //     y: 50,
    //     width: 200,
    //     height: 75,
    // });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Trigger the browser to download the PDF document
    download(pdfBytes, "pdf-lib_modification_example.pdf", "application/pdf");
}
