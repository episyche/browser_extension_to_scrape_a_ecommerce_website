chrome.runtime.onMessage.addListener(function (message) {
  if (message.action === 'startGrabbing') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        function: productPicker,
      });
    });
  }
});

async function productPicker() {
  // open api call funciton
  const OpenApiRequest = async (requestdata) => {
    let returnData;
    await fetch('https://api.openai.com/v1/chat/completions',
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer"
        },
        body: JSON.stringify({
          "model": "gpt-3.5-turbo",
          "messages": [
            {
              "role": "system",
              "content": `

              Given the specific product information from Aliexpress Data, craft a compelling and attention-grabbing title and description in following valid as a JSON RFC 8259 data suitable for a Facebook Marketplace listing. Ensure the title is concise yet descriptive, capturing the essence of the product. The description should be detailed, highlighting key features and benefits of the product, and written in a tone that engages potential buyers on Facebook Marketplace. Include any relevant specifications and make the content appealing to a broad audience. Include "Tags: "followed by 20 capitalised (first letter only) single word tags relevant to the product/category at the bottom of the listing description.
              The format for each message should match the following example:
              {
              title:"[product] is [insert why it is so great]!",
               description:"This [product] is the perfect addition to anyones",
               tags:[Example1, Example2, Example3, Etc]
              }
                  Aliexpress Data:${requestdata}`
            }]
        })

      }
    )
      .then((data) => data.json())
      .then((res) => {
        returnData = res
      })
    return returnData;
  }

  // uuid generation code
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // This code   get image 
  async function getBlob(imageurl) {
    const blob = await fetch(imageurl)
      .then(function (response) {
        return response.blob();
      })
      .catch(function (err) {
      })
    return blob
  }

  // this code image data to convert blog data
  async function toBase64(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  // this code file download code
  const fileDownload = (blobadata, type, filename) => {
    const blob = new Blob([blobadata], { type: type });
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    return true
  }


  const DataWrapfunction = async () => {
    let navdescription = document.getElementById('nav-description')
    if (navdescription) {
      navdescription.click()
    }

    const overallJson = {}
    let splitList;
    const actualPrice = document.querySelector(".price--originalText--Zsc6sMv");
    if (actualPrice) {
      overallJson["actualPrice"] = actualPrice.innerText
    }
    const discountPrice = document.querySelector(".product-price-current");
    if (discountPrice) {
      overallJson["discountPrice"] = discountPrice.innerText
    }
    const offers = document.querySelector(".price--discount--xET8qnP");
    if (offers) {
      overallJson["offers"] = offers.innerText
    }
    const title = document.querySelector(".title--wrap--Ms9Zv4A");
    if (title) {
      overallJson["title"] = title.innerText
    }
    const reviewAndSold = document.querySelector(".reviewer--wrap--sPGWrNq");
    if (reviewAndSold) {
      overallJson["reviewAndSold"] = reviewAndSold.innerText
    }
    const couponAndDiscount = document.querySelector(".discount--wrap--R0VuYMn");
    if (couponAndDiscount) {
      overallJson["couponAndDiscount"] = couponAndDiscount.innerText
    }
    const allProperty = document.getElementsByClassName('sku-item--property--Wk6aoYj');
    for (let m = 0; m < allProperty.length; m++) {
      const propertyTitle = allProperty[m].getElementsByClassName('sku-item--title--gcxMSdg')[0];
      if (propertyTitle) {
        let keyname = propertyTitle.innerText
        splitList = keyname.split(":")
      }

      const value = allProperty[m].getElementsByClassName('sku-item--box--6Mh3HRv');

      let listdata = []
      for (let n = 0; n < value.length; n++) {
        const propertyList = value[n].getElementsByClassName('sku-item--text--s0fbnzX')
        const image = value[n].getElementsByTagName("img");
        const imageButton = value[n].getElementsByTagName("button")
        for (let n = 0; n < imageButton.length; n++) {
          if (imageButton[n].className.includes("imageViewMore")) {
            imageButton[n].click()
          }
        }
        if (image.length) {
          for (let p = 0; p < image.length; p++) {
            let imageJsonData = {};
            imageJsonData["img.url"] = image[p].src;
            imageJsonData["img.alt"] = image[p].alt;
            imageJsonData["img.count"] = p + 1;


            // this code for image download
            let data = await getBlob(image[p].src)
            let base64data = await toBase64(data)
            let findtype = (image[p].src).split('.')
            let findtypedata = findtype[findtype.length - 1]
            let base64WithoutPrefix = base64data.split(',')[1];
            let binaryString = atob(base64WithoutPrefix);
            let uint8Array = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              uint8Array[i] = binaryString.charCodeAt(i);
            }
            let imageName = generateUUID()

            listdata.push(imageJsonData)
          }
        } else {
          for (let n = 0; n < propertyList.length; n++) {
            listdata.push(propertyList[n].innerText)
          }
        }
      }
      overallJson[splitList[0]] = listdata
    }
    const specButton = document.getElementsByTagName("button")
    for (let m = 0; m < specButton.length; m++) {
      if (specButton[m].className.includes("specification--btn")) {
        specButton[m].click()

      }
    }
    const specifications = document.getElementById("nav-specification");


    const specificationUlTag = specifications.getElementsByTagName("ul");
    const specList = [];

    if (specificationUlTag.length) {
      for (let p = 0; p < specificationUlTag.length; p++) {
        const specificationLiTag = specificationUlTag[p].getElementsByTagName("li");
        for (let i = 0; i < specificationLiTag.length; i++) {

          const specData = specificationLiTag[i].querySelectorAll(".specification--prop--RejitI8")

          for (let j = 0; j < specData.length; j++) {
            const specDataList = specData[j].querySelectorAll("div");
            let keyName, valueName;
            let specJsonData = {};
            for (let k = 0; k < specDataList.length; k++) {
              const title = specDataList[k].className.includes("title");
              if (title) {
                keyName = specDataList[k].innerText
              }
              else {
                valueName = specDataList[k].innerText
              }
            }
            specJsonData[keyName] = valueName
            specList.push(specJsonData)
          }
        }
      }
    }

    overallJson["specifications"] = specList
    const descButton = document.getElementsByTagName("button")
    for (let m = 0; m < descButton.length; m++) {
      if (descButton[m].className.includes("large extend--btn")) {
        descButton[m].click()

      }
    }

    // this description functions
    const DescriptionData = async () => {
      const descriptions = Array.from(document.getElementsByClassName("description--product-description--nxRv0lW"))
      let textJsonData = {};
      const descriListData = [];
      overalldescription = {}
      descriptions.forEach(async (ele, ind, arr) => {
        textJsonData['descriptionContent'] = ele.innerText
        const descriImage = Array.from(ele.getElementsByTagName("img"));


        let bar = new Promise((resolve, reject) => {
          descriImage.forEach(async (element, index, array) => {
            let descriJsonData = {};
            descriJsonData["img.url"] = element.src;
            descriJsonData["img.alt"] = element.alt;
            descriJsonData["img.count"] = index + 1;
            // this code for image download
            let data = await getBlob(element.src)
            let base64data = await toBase64(data)
            let findtype = (element.src).split('.')
            let findtypedata = findtype[findtype.length - 1]
            let base64WithoutPrefix = base64data.split(',')[1];
            let binaryString = atob(base64WithoutPrefix);
            let uint8Array = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              uint8Array[i] = binaryString.charCodeAt(i);
            }

            let imageName = generateUUID()
            await fileDownload(uint8Array, "image/png", imageName + ".png")
            // fileDownload(uint8Array, "image/" + findtypedata, imageName)
            // end  code for image download
            descriListData.push(descriJsonData)

            if (index === array.length - 1) resolve();
          });
        });
        bar.then(() => {
          textJsonData['description-Image'] = descriListData
          return textJsonData;
        });
        if (descriImage.length == 0) {
          return textJsonData;
        }
      })
      return textJsonData
    }

    let description = await DescriptionData()
    console.log("description ", description)
    overallJson['description'] = description
    let filename = generateUUID()
    let scrapped_initial_file = await fileDownload(JSON.stringify(overallJson), "application/json", "scrapped_" + filename)
    const res = await OpenApiRequest({ title: overallJson['title'], specifications: overallJson['specifications'] })
    console.log("REs", res, overallJson, scrapped_initial_file)
    if (res) {
      if (res.choices) {
        try {
          let data = JSON.parse(res.choices[0].message.content)
          console.log("data", data)
          try {
            if (data.chatGptResponse.tags == undefined) {
              if (data.chatGptResponse.description.includes('Tags')) {
                var splittag = ((data.chatGptResponse.description.split('Tags')[1]).split(":")[1]).split(",")
                data['tags'] = splittag
              } else if (data.chatGptResponse.description.includes('tags')) {
                var splittag = ((data.chatGptResponse.description.split('tags')[1]).split(":")[1]).split(",")
                data['tags'] = splittag

              }
            }
          } catch (er) {

          }
          overallJson['chatGptResponse'] = data
        } catch (error) {
          console.log("error----->", error)
          overallJson['chatGptResponse'] = res.choices[0].message.content

        }
      }
    }
    let scrapped_final_file = await fileDownload(JSON.stringify(overallJson), "application/json", "final_" + filename)
    return true;

  }
  await DataWrapfunction()
}