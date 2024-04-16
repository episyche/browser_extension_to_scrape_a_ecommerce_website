async function TEST(requestdata) {
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
                  {title:"[product] is [insert why it is so great]!"
                   description:"This [product] is the perfect addition to anyone’s"
                   tags:[Example, Example, Example, Etc]}
                      Aliexpress Data:${requestdata}
                      
                      `}]
            })

        }
    )
        .then((data) => data.json())
        .then((res) => {
            // console.log(res)
            console.log(res.choices[0].message.content)
            let data = JSON.parse(res.choices[0].message.content)
            console.log("data", data)

        })

}
const jsoncontent = {
    "title": "Lenovo Wireless Headphone Bluetooth Earphones Touch Control Headset Waterproof Sports In-ear Earbuds With Microphone",
    "specifications": [
        {
            "Material": "Plastic"
        },
        {
            "Weight[g]": "50"
        },
        {
            "Battery Capacity[mAh]": "300-3000"
        },
        {
            "Voice assistant built-in": "YES"
        },
        {
            "Maximum wireless range[m]": "10m-20m"
        },
        {
            "Sound Isolating": "YES"
        },
        {
            "Category": "Earphones & Headphones"
        },
        {
            "Earcups Type": "Sealed"
        },
        {
            "Max Output": "80mW"
        },
        {
            "Number Of Drivers": "2"
        },
        {
            "Charging Method": "Charging case"
        },
        {
            "Headphone Pads Material": "Silicone"
        },
        {
            "Magnet Type": "Ferrite"
        },
        {
            "Driver Diameter": "13mm"
        },
        {
            "Total Harmonic Distortion": "1%"
        },
        {
            "Impedance Range": "up to 32 Ω"
        },
        {
            "Bluetooth Version": "5.0"
        },
        {
            "Package List": "User Manual,Charging case,Charging Cable"
        },
        {
            "Features": "waterproof,With Microphone"
        },
        {
            "Codecs": "NONE"
        },
        {
            "With Microphone": "Yes"
        },
        {
            "Is wireless": "Yes"
        },
        {
            "Support APP": "Yes"
        },
        {
            "Support Memory Card": "No"
        },
        {
            "Waterproof": "Yes"
        },
        {
            "Resistance": "12Ω"
        },
        {
            "Line Length": "0m"
        },
        {
            "Frequency Response Range": "20 - 20000Hz"
        },
        {
            "Sensitivity": "125dB"
        },
        {
            "Plug Type": "NONE"
        },
        {
            "Function": "for Video Game,Common Headphone,For Mobile Phone,HiFi Headphone,Sport,For Outdoor,For Swimming,For Office,For Study"
        },
        {
            "Active Noise-Cancellation": "No"
        },
        {
            "Volume Control": "Yes"
        },
        {
            "Control Button": "Yes"
        },
        {
            "Vocalism Principle": "Dynamic"
        },
        {
            "Wireless Type": "bluetooth"
        },
        {
            "Connectors": "USB"
        },
        {
            "Communication": "Wireless"
        },
        {
            "Style": "In-ear"
        },
        {
            "Certification": "CE,FCC"
        },
        {
            "Origin": "Mainland China"
        },
        {
            "Brand Name": "Lenovo"
        },
        {
            "Lenovo Model": "LP5"
        },
        {
            "lenovo wireless earphone": "wireless headset"
        },
        {
            "bluetooth earphone": "bluetooth headset"
        },
        {
            "wireless headphones": "wireless earbuds"
        }
    ]
}

TEST(jsoncontent)