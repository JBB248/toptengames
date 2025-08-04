// This is a one-off project to brush up my web skills
// There is no way this works on older browsers, but it doesn't really matter

document.addEventListener("DOMContentLoaded", function(_) {
    fetch("./data.json")
        .then(response => response.json())
        .then(loadJson);
});

function loadJson(json)
{
    if(!(json instanceof Array))
    {
        console.warn("Incorrect json format. See 'https://jbb248.github.io/toptengames/data.json' for an example.");
        return;
    }

    const FULLSCREEN = "fullscreen";
    const DUO = "duo";
    const TRIO = "trio";

    let count = 1;

    const debugTextInput = document.createElement("textarea");
    debugTextInput.wrap = true;
    debugTextInput.rows = 10;

    document.getElementById("fuck-gamestop").addEventListener("click", function(event) {
        if(event.detail === 3)
            saveJson();
    });

    function saveJson()
    {
        const titles = document.getElementById("top-titles-section");
        const data = [];
        for(const child of titles.children)
        {
            if(child.classList.contains("fullscreen-section"))
                data.push(generateFullscreenData(child));
            if(child.classList.contains("duo-section"))
                data.push(generateDuoData(child));
            if(child.classList.contains("trio-section"))
                data.push(generateTrioData(child));
        }

        var a = document.createElement("a");
        var file = new Blob([JSON.stringify(data, null, "\t")], {type: 'text/plain'});
        a.href = URL.createObjectURL(file);
        a.download = 'data.json';
        a.click();
    }

    function generateFullscreenData(element)
    {
        return {
            type: "fullscreen",
            titles: [
                {
                    "title": element.children[2].children[1].innerText,
                    "image-link": element.children[0].getAttribute("image-link"),
                    "image-source": {
                        "title": element.children[1].children[0].innerText,
                        "link": element.children[1].children[0].href
                    },
                    "description": element.children[2].children[2].innerText
                }
            ]
        };
    }

    function generateDuoData(element)
    {
        return {
            type: "duo",
            titles: [
                mulitDataHelper(element.children[0]),
                mulitDataHelper(element.children[1])
            ]
        };
    }

    function generateTrioData(element)
    {
        return {
            type: "trio",
            titles: [
                mulitDataHelper(element.children[0]),
                mulitDataHelper(element.children[1]),
                mulitDataHelper(element.children[2])
            ]
        };
    }

    function mulitDataHelper(element)
    {
        const cStyle = element.children[0].children[0].style;
        const styleMap = {};

        for (let i = 0; i < cStyle.length; i++) {
            const propertyName = cStyle[i];
            const propertyValue = cStyle.getPropertyValue(propertyName);
            styleMap[propertyName] = propertyValue;
        }

        return {
            "title": element.children[2].children[1].innerText,
            "image-link": element.children[0].children[0].src,
            "image-source": {
                "title": element.children[1].children[0].innerText,
                "link": element.children[1].children[0].href
            },
            "description": element.children[2].children[2].innerText,
            "special-image-css": styleMap
        }
    }

    function appendFullscreenSection(element)
    {
        const container = document.createElement("div");
        container.classList.add("fullscreen-section");

        const background = document.createElement("div");
        background.className = "fullscreen-image";
        background.setAttribute("image-link", element["image-link"]);
        background.style.backgroundImage = "linear-gradient(180deg, var(--dark-color), transparent, var(--dark-color)), url(" + element["image-link"] + ")";
        addDebugToBackground(background);

        container.appendChild(background);
        creditsHelper(container, element, true);
        textSectionHelper(container, element, true);
        document.getElementById("top-titles-section").appendChild(container);
    }

    function appendDuoSection(element1, element2)
    {
        const container = document.createElement("div");
        container.classList.add("flex-section");
        container.classList.add("duo-section");

        const div1 = document.createElement("div");
        div1.classList.add("duo-item")
        flexSectionHelper(div1, element1);

        const div2 = document.createElement("div");
        div2.classList.add("duo-item")
        flexSectionHelper(div2, element2);

        container.appendChild(div1);
        container.appendChild(div2);
        document.getElementById("top-titles-section").appendChild(container);
    }

    function appendTrioSection(element1, element2, element3)
    {
        const container = document.createElement("div");
        container.classList.add("flex-section");
        container.classList.add("trio-section");

        const div1 = document.createElement("div");
        div1.classList.add("trio-item")
        flexSectionHelper(div1, element1);

        const div2 = document.createElement("div");
        div2.classList.add("trio-item")
        flexSectionHelper(div2, element2);

        const div3 = document.createElement("div");
        div3.classList.add("trio-item")
        flexSectionHelper(div3, element3);

        container.appendChild(div1);
        container.appendChild(div2);
        container.appendChild(div3);
        document.getElementById("top-titles-section").appendChild(container);
    }

    function textSectionHelper(container, element, indent=false)
    {
        const description = document.createElement("div");
        description.className = "text-section";
        if(!indent)
            description.classList.add("no-indent");

        const rank = document.createElement("h1");
        rank.innerText = count + ". ";
        rank.style.display = "inline";

        const title = document.createElement("h1");
        title.innerText = element["title"];
        title.style.display = "inline";
        title.id = "title";

        if(count == 1)
            rank.style.color = title.style.color = "#EFBF04";
        if(count == 3)
            rank.style.color = title.style.color = "#CD7F32";

        const text = document.createElement("p");
        text.innerText = element["description"];

        description.appendChild(rank);
        description.appendChild(title);
        description.appendChild(text);
        addDebugToText(title);
        addDebugToText(text);

        container.appendChild(description);

        count++;
    }

    function flexSectionHelper(container, element)
    {
        const imageContainer = document.createElement("div");
        imageContainer.classList.add("showoff-image-container");

        const image = document.createElement("img");
        image.setAttribute("src", element["image-link"]);
        image.classList.add("showoff-image");
        Object.keys(element["special-image-css"]).forEach(key => image.style.setProperty(key, element["special-image-css"][key]));
        addDebugToImage(image);

        imageContainer.appendChild(image);
        container.appendChild(imageContainer);

        creditsHelper(container, element);
        textSectionHelper(container, element);
    }

    function creditsHelper(container, element, indent=false)
    {
        if(!element["image-source"]) return

        const credits = document.createElement("p");
        credits.innerHTML = 'Image sourced from: <a target="_blank" href=' + element["image-source"].link + '>' + element["image-source"].title + '</a>';
        credits.style.margin = "0px";
        if(indent)
            credits.classList.add("text-section");
        
        container.appendChild(credits);
    }

    function addDebugToText(text)
    {
        text.addEventListener("click", function(event) {
            if(event.detail === 3)
                pullUpDebugTextInput(text);
        });
    }

    function pullUpDebugTextInput(text)
    {
        debugTextInput.value = text.innerText;
        debugTextInput.hidden = false;
        debugTextInput.focus();
        debugTextInput.addEventListener("focusout", (_) => {
            text.innerText = debugTextInput.value;
            debugTextInput.hidden = true;
        }, {once: true});
        text.after(debugTextInput);
    }

    function addDebugToBackground(image)
    {
        image.addEventListener("click", function(event) {
            if(event.detail === 3)
                pullUpDebugFullscreenInput(image);
        });
    }

    function pullUpDebugFullscreenInput(background)
    {
        debugTextInput.value = background.getAttribute("image-link");
        debugTextInput.hidden = false;
        debugTextInput.focus();
        debugTextInput.addEventListener("focusout", (_) => {
            background.setAttribute("image-link", debugTextInput.value);
            background.style.backgroundImage = "linear-gradient(180deg, var(--dark-color), transparent, var(--dark-color)), url(" + debugTextInput.value + ")";
            debugTextInput.hidden = true;
        }, {once: true});
        background.after(debugTextInput);
    }

    function addDebugToImage(image)
    {
        image.addEventListener("click", function(event) {
            if(event.detail === 3)
                pullUpDebugImageInput(image);
        });
    }

    function pullUpDebugImageInput(image)
    {
        debugTextInput.value = image.src;
        debugTextInput.hidden = false;
        debugTextInput.focus();
        debugTextInput.addEventListener("focusout", (_) => {
            image.src = debugTextInput.value;
            debugTextInput.hidden = true;
        }, {once: true});
        image.after(debugTextInput);
    }


    json.forEach((element, index) => {
        if(element.type == FULLSCREEN)
            if(element.titles && element.titles instanceof Array && element.titles.length > 0)
                appendFullscreenSection(element.titles[0]);
            else
                console.warn("Section " + (index + 1) + " (fullscreen section) either could not be read or is empty.");
        else if(element.type == DUO)
            if(element.titles && element.titles instanceof Array && element.titles.length > 1)
                appendDuoSection(element.titles[0], element.titles[1]);
            else
                console.warn("Section " + (index + 1) + " (duo section) either could not be read or does not contain at least two titles.");

        else if(element.type == TRIO)
            if(element.titles && element.titles instanceof Array && element.titles.length > 2)
                appendTrioSection(element.titles[0], element.titles[1], element.titles[2]);
            else
                console.warn("Section " + (index + 1) + " (trio section) either could not be read or does not contain at least three titles.");
        else
            console.warn("Section " + (index + 1) + " has no valid type");
    });
}
