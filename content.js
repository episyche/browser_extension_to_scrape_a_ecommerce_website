let navdescription = document.getElementById('nav-description')
if (navdescription) {
    navdescription.click()
    navdescription.scrollIntoView({ behavior: 'smooth' });
}


// View more BUtton
const imageButton = Array.from(document.getElementsByTagName("button"))
if (imageButton.length) {
    imageButton.forEach(async (element, index, array) => {
        console.log("element", element)
        if (element.className.includes("imageViewMore")) {
            element.click()
        }
        if (String(element.innerText).toLowerCase().includes('view more')) {
            element.click()
        }
    })
}