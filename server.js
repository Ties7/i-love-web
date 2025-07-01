// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from 'express'

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from 'liquidjs';

// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

// Maak werken met data uit formulieren iets prettiger
app.use(express.urlencoded({extended: true}))

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid()
app.engine('liquid', engine.express())

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
app.set('views', './views')

// fix omdat het lokale json is
import { readFile } from 'fs/promises';

// -------------------- FUNCTIES --------------------

async function listWork() {
  const file = await readFile('./data/work.json', 'utf-8');
  const json = JSON.parse(file);
  return json;
}

async function getWork(id) {
  const file = await readFile('./data/work.json', 'utf-8');
  const data = JSON.parse(file);

  const result = data.find(item => item.id === id);
  return result;
}

// -------------------- PAGINA'S --------------------

app.get('/', async function (request, response) {
  const work = await listWork();
  response.render("index.liquid", { work: work });
})

app.get('/work/:id', async function (request, response) {
  const workId = request.params.id;
  const work = await getWork(workId);
  console.log(work);

  response.render("work-detail.liquid", { work });
})

app.get('/projects', async function (request, response) {
  response.render("projects.liquid");
})

// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000; als deze applicatie ergens gehost wordt, waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// Start Express op, gebruik daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  console.log(`Project draait via http://localhost:${app.get('port')}/\n\nSucces deze sprint. En maak mooie dingen! 🙂`)
})