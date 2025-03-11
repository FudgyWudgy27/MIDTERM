import { jsPDF } from "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.0.0/jspdf.es.js";

class GeneratePdf {
    // pdfDoc will hold an instance of jsDPF (our PDF Document)
    pdfDoc; 
    // Position used for controlling where elements are on the pdf
    position = {
        x: 10,
        y: 20,
    }
    // Margin used for adding fluff away from page borders
    margin = {
        x: 10,
        y: 20,
    }
    // Page counter used for tracking how many pages exist in the pdf
    pageCounter = 1;
    // Dom ref is used to be able to update teh DOM with the pdf
    domRef = "";

    hCount = 0;
    aCount = 0;
    mCount = 0;

    hPrice = 10;
    aPrice = 100;
    mPrice = 15;

    hTotal = 0;
    aTotal = 0;
    mTotal = 0;

    subtotal = 0;
    tax = 0;
    total = 0;

    name = "";
    email = "";

    invoiceNumber = Math.floor(Math.random() * 100000000);

    date = new Date();

    todaysDate = this.date.toLocaleDateString();
    currentTime = this.date.toLocaleTimeString();

    addH(){
        this.hCount += 1;
    }
    addA(){
        this.aCount += 1;
    }
    addM(){
        this.mCount += 1;
    }

    calcTotal(){
        this.hTotal = (this.hCount * this.hPrice);
        this.aTotal = (this.aCount * this.aPrice);
        this.mTotal = (this.mCount * this.mPrice);

        this.subtotal = (this.hTotal + this.aTotal + this.mTotal);
        this.tax = (this.subtotal * .07);

        this.total = (this.subtotal + this.tax);
    }

    /**
     * 
     * @param {string} domRefId The id of the iframe used for rendering the pdf
     */
    constructor(domRefId){
        this.pdfDoc = new jsPDF();
        this.pdfDoc.setFontSize(11);
        if(domRefId){
            this.domRef = document.querySelector(`#${domRefId}`);
        }
    }

    /**
     * @description Used to download the pdf onto the client's device
     */
    downloadPdf(){
        this.pdfDoc.save(`invoice${this.invoiceNumber}.pdf`);
    }

    /**
     * 
     * @returns A string value with a domain local url for the pdf
     */
    getPdfUrl(){
        return this.pdfDoc.output("bloburl") + "#toolbar=1";
    }

    /**
     * 
     * @param {string} text Content displayed in header
     * @param {string} color Adds color to the text
     */
    addHeader(text, color = "black"){
        this.pdfDoc.setFontSize(16);
        this.pdfDoc.setTextColor(color);
        this.pdfDoc.text(text, this.position.x, this.position.y);
        this.pdfDoc.setFontSize(11);
        this.position.y += 8;
        this.pdfDoc.setTextColor("black");
    }

    /**
     * 
     * @param {string} text Content for the paragraph
     * @param {string} text Adds color to the text
     */
    addText(text, color = "black"){
        this.pdfDoc.setTextColor(color);
        this.pdfDoc.text(text, this.position.x, this. position.y);
        this.position.y += 5.5;
        this.pdfDoc.setTextColor("black");
    }

    /**
     * @description Looping through the pages from last to first then deleting them. After all pages are deleted, it resets the pageCounter and adds a new blank page.
     */
    resetPdf(){
        for(let i = this.pageCounter; i > 0; i--){
            this.pdfDoc.deletePage(i);
        }
        this.pdfDoc.deletePage(1);
        this.pdfDoc.addPage();
        
        this.showPdf();
    }

    /**
     * @description Resets the x/y position, based on the margin, then adds a new blank page, increasing the pageCounter
     */
    newPage(){
        this.position = { ...this.margin};
        this.pdfDoc.addPage();
        this.pageCounter++;
    }

    /**
     * @description Updates the dom to show the pdf in the iframe
     */
    showPdf(){
        if(this.domRef){
            this.domRef.src = this.getPdfUrl();
        }
    }

    addBackground({color = "black", fontSize = 11} = {}){
        const offset = fontSize / 2;
        // S = stroke / border of rect
        // F = fill / background of rect
        this.pdfDoc.setFillColor(color);
        this.pdfDoc.rect(this.position.x, this.position.y - ((offset * 3)/4), 100, offset, "S");
        this.pdfDoc.setFillColor("white");
    }
}

const invoicePDF = new GeneratePdf("invoicePreview");

document.getElementById("hammerButton").addEventListener("click", function() {invoicePDF.addH();});
document.getElementById("anvilButton").addEventListener("click", function() {invoicePDF.addA();});
document.getElementById("moldButton").addEventListener("click", function() {invoicePDF.addM();});

document.getElementById("submitButton").addEventListener("click", function() {invoicePDF.name = document.getElementById("nameInput").value; invoicePDF.email = document.getElementById("emailInput").value;});

document.getElementById("generateButton").addEventListener("click", function() {
    if(invoicePDF.hCount === 0 && invoicePDF.aCount === 0 && invoicePDF.mCount === 0 || invoicePDF.name === "" || invoicePDF.email === ""){

    } else {
        invoicePDF.calcTotal();
        invoicePDF.addHeader("Smith's Smithing Tools");
        invoicePDF.addText("Phone: (765)541-XXXX");
        invoicePDF.addText("Email: smithsmithing@gmail.com");
        invoicePDF.addText("Open: M-F 8:00-5:00");
        invoicePDF.addText("");
        invoicePDF.addText("Customer:");
        invoicePDF.addText(`Name: ${invoicePDF.name}`);
        invoicePDF.addText(`Email: ${invoicePDF.email}`);
        invoicePDF.addText("");
        invoicePDF.addText(`Invoice Number: ${invoicePDF.invoiceNumber}`);
        invoicePDF.addText(`Time of Purchase: ${invoicePDF.currentTime} ${invoicePDF.todaysDate}`);
        invoicePDF.addText("");
        if(invoicePDF.hCount > 0){
            invoicePDF.addText(`Steel Hammer: $${invoicePDF.hPrice.toFixed(2)} * ${invoicePDF.hCount} = $${invoicePDF.hTotal.toFixed(2)}`);
        }
        if(invoicePDF.aCount > 0){
            invoicePDF.addText(`Steel Anvil: $${invoicePDF.aPrice.toFixed(2)} * ${invoicePDF.aCount} = $${invoicePDF.aTotal.toFixed(2)}`);
        }
        if(invoicePDF.mCount > 0){
            invoicePDF.addText(`Ingot Mold: $${invoicePDF.mPrice.toFixed(2)} * ${invoicePDF.mCount} = $${invoicePDF.mTotal.toFixed(2)}`);
        }
        invoicePDF.addText("");
        invoicePDF.addText(`Subtotal: $${invoicePDF.subtotal.toFixed(2)}`);
        invoicePDF.addText(`Tax (7%): $${invoicePDF.tax.toFixed(2)}`);
        invoicePDF.addText("Total:");
        invoicePDF.addText("");
        invoicePDF.addHeader(`$${invoicePDF.total.toFixed(2)}`);

        invoicePDF.showPdf();
        document.getElementById("downloadButton").removeAttribute("hidden");
    }
});

document.getElementById("downloadButton").addEventListener("click", function () { invoicePDF.downloadPdf() })