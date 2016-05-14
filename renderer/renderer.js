import {getPulls} from './lib/api'
import {Application} from './lib/components'

const component = new Application({pulls: []})
document.body.appendChild(component.element)

getPulls(pulls => {
  console.log("updated", pulls)
  component.update({ pulls })
})
