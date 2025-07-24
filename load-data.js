// This is a one-off project to brush up my web skills
// There is no way this works on older browsers, but it doesn't really matter

document.addEventListener("DOMContentLoaded", function(_) {
    fetch("./data.json")
        .then(response => response.json())
        .then(loadJson);
});

function loadJson(json)
{
    const FULLSCREEN = "fullscreen";
    const DUO = "duo";
    const TRIO = "trio";

    let count = 1;

    function appendFullscreenSection(element)
    {
        const background = document.createElement("div");
        background.className = "fullscreen-section";
        background.style.backgroundImage = "linear-gradient(180deg, var(--dark-color), transparent, var(--dark-color)), url(" + element["image-link"] + ")"

        document.getElementById("content").appendChild(background);
        textSectionHelper(document.getElementById("content"), element);
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
        document.getElementById("content").appendChild(container);
    }

    function appendTrioSection(element1, element2, element3)
    {
        const container = document.createElement("div");
        container.className = "flex-section";

        const div1 = document.createElement("div");
        div1.classList.add("trio-item")
        flexSectionHelper(div1, element1, false);

        const div2 = document.createElement("div");
        div2.classList.add("trio-item")
        flexSectionHelper(div2, element2, false);

        const div3 = document.createElement("div");
        div3.classList.add("trio-item")
        flexSectionHelper(div3, element3, false);

        container.appendChild(div1);
        container.appendChild(div2);
        container.appendChild(div3);
        document.getElementById("content").appendChild(container);
    }

    function textSectionHelper(container, element, indent=true)
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

    function flexSectionHelper(container, element, indent=true)
    {
        const image = document.createElement("img");
        image.setAttribute("src", element["image-link"]);
        image.classList.add("showoff-image");
        if(element["special-css"])
            element["special-css"].forEach(style => image.style.setProperty(style[0], style[1]));

        container.appendChild(image);
        textSectionHelper(container, element, indent);
    }

    json.forEach(element => {
        if(element.type == FULLSCREEN)
            appendFullscreenSection(element.titles[0]);
        else if(element.type == DUO)
            appendDuoSection(element.titles[0], element.titles[1]);
        else if(element.type == TRIO)
            appendTrioSection(element.titles[0], element.titles[1], element.titles[2]);
    });
}