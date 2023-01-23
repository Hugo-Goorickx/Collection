class Card
{
    constructor (title, plot, director, actors, released, metascore, boxoffice, img, vid)
    {
        this.title = title;
        this.plot = plot;
        this.director = director;
        this.actors = actors;
        this.released = released;
        this.metascore = metascore;
        this.boxoffice = boxoffice;
        this.img = img;
        this.vid = vid;
    }
    
    //setup la div avec contenu
    addElement(className, content)
    {
        let new_span = document.createElement('div');
        let new_content = document.createTextNode(content);

        new_span.classList.add(className);
        new_span.appendChild(new_content);
        return new_span
    }
    
    //setup la div sans contenu
    global_div(content, className)
    {
        let tmp = document.createElement('div');
        tmp.classList.add(className);
        if (content)
            content.appendChild(tmp);
        return tmp;
    }
    
    //genere la carte
    gen_card()
    {
        //init card
        let start = document.getElementsByTagName("main")[0];
        let content = this.global_div(start, 'container');
        
        //add all information
        let tmp = this.global_div(content, 'content');
        
        //create the button to launch the trailler
        let new_span = document.createElement('button');
        new_span.classList.add('title');
        new_span.appendChild(document.createTextNode(this.title));
        new_span.addEventListener("click", this.show.bind(this));
        tmp.appendChild(new_span);

        //add all datas
        tmp.append(this.addElement("plot", this.plot) ,this.addElement("director", "Director : " + this.director) ,this.addElement("actors", "Actros : " + this.actors) ,this.addElement("released", "Date de sortie : " + this.released));
        
        let tmp2 = this.global_div(tmp, 'end');
        tmp2.append(this.addElement("metascore", "Metascore : " + this.metascore), (this.addElement("boxoffice", "Box Office : " + this.boxoffice)));
        
        //setup the picture
        let test = this.global_div(content, 'flap');
        test.style.setProperty('--img', "url("+this.img+")");
    }

    //show the trailler
    show()
    {
        let start       = document.getElementsByTagName("main")[0];
        let cover       = document.createElement('div');
        let new_span    = document.createElement('iframe');
        let new_content = document.createTextNode("Exit");
        let out_button  = document.createElement('button');

        setAtt(new_span, {"width" : window.innerWidth, "height" : window.innerHeight, "title" : this.title, "frameborder" : "0", "allowfullscreen" : "", "allow" : "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", "src" : this.vid});
        
        out_button.classList.add('exit');
        out_button.appendChild(new_content);
        out_button.addEventListener("click", function() { document.getElementsByClassName("cover")[0].remove(); });
        
        cover.classList.add('cover');
        cover.append(out_button, new_span);
        start.appendChild(cover);
    }
}

function setAtt(className, all_datas)
{
    for (let elem in all_datas)
        className.setAttribute(elem , all_datas[elem]);
}

//affiche les 3 cardes en focntion de la page ou on se situe
function onLoadHandler()
{

    document.querySelectorAll('.container').forEach(elem => {elem.remove();});
    
    for (let i = 0; i < nb_card;i++)
    {
        if (++global_index >= all_img.length)
            global_index = 0;
        if (all_img[global_index])
            all_img[global_index].gen_card();
    }
    
    let tmp = document.querySelectorAll('.container');
    for(let i = 0; i < nb_card;i++)
        if (tmp[i])
            tmp[i].style.left = ((280 * i) + (space * (i + 1))) + "px";
}

function down()
{
    global_index -= nb_card * 2;
    if (global_index < 0)
        global_index += all_img.length;
    onLoadHandler();
}

function up()
{
    if (global_index > all_img.length)
        global_index = 0;
    onLoadHandler();
}

let global_index = 0,
    size_all = window.innerWidth,
    nb_card = 0,
    space,
    all_img = [];

while (size_all >= 320 && nb_card < 5)
{
    size_all -= 320;
    nb_card++;
}
size_all = window.innerWidth;
for (let i = 0; i < nb_card; i++)
    size_all -= 280;
space = size_all / (nb_card + 1);

//Setup function using in html
document.getElementById("b1").onclick = function() {up ()};
document.getElementById("b2").onclick = function() {down ()};

const fetchName = () => fetch('./test.json');

fetchName()
	.then((response) => response.json())
	.then((json) => {
        json.collection.forEach(elem => { all_img.push(new Card(elem.Title, elem.Plot, elem.Real, elem.Cast, elem.Date, elem.Metascore, elem.Boxoffice, elem.img, elem.video));});
        onLoadHandler();
	})
	.catch((error) => {
		console.log("There was an error!", error);
	});