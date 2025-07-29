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

    function appendFullscreenSection(element)
    {
        const container = document.createElement("div");
        container.classList.add("fullscreen-section");

        const background = document.createElement("div");
        background.className = "fullscreen-image";
        background.style.backgroundImage = "linear-gradient(180deg, var(--dark-color), transparent, var(--dark-color)), url(" + element["image-link"] + ")"

        container.appendChild(background);
        creditsHelper(container, element, true);
        textSectionHelper(container, element, true);
        document.getElementById("top-titles-section").appendChild(container);
    }

    function appendDuoSection(element1, element2)
    {
        const container = document.createElement("div");
        container.className = "flex-section";

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
        container.className = "flex-section";

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

        const title = document.createElement("h1");
        title.innerText = count + ". " + element["title"];
        if(count == 1)
            title.style.color = "#EFBF04";
        if(count == 3)
            title.style.color = "#CD7F32";
        const text = document.createElement("p");
        text.innerText = element["description"];

        description.appendChild(title);
        description.appendChild(text);

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
        if(element["special-image-css"])
            element["special-image-css"].forEach(style => image.style.setProperty(style[0], style[1]));

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
