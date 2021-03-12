# as-deepjson
AssemblyScript module for getting values deep in JSON easily

## Usage

```
import { DeepJsonParse } from "as-deepjson";

const json = `
{
    "animals": {
        "cats": [
            {
                "name": "Mittens",
                "age": 3
            }
        ]
    }
}

`.trim()

const parsed = new DeepJsonParse(json)
const value = res.get("animals.cats[0].name")

if(value != null){
    const name = value.toString()
    // name == "Mittens"
}

```