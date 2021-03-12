import { JSON } from "assemblyscript-json";

export class DeepJsonParse {
    _nodes: Map<string, JsonNode>

    constructor(json: string) {
        this._nodes = new Map<string, JsonNode>();

        this._nodes.set("", new JsonNode("", JSON.parse(json)))

        this.digNode("")
    }

    private digNode(path: string): void {
        const root: JsonNode = this._nodes.get(path)

        if (root.isObject() || root.isArray()) this.digObject(root);
    }

    private digObject(root: JsonNode): void {
        const children: Array<JsonNode> = root.children()

        for(let i = 0 ; i < children.length; i++){
            this._nodes.set(children[i].path, children[i])
            this.digNode(children[i].path)
        }
    }

    hasKey(path: string): bool {
        return this._nodes.has(path)
    }

    get(path: string): JSON.Value | null {
        if(!this.hasKey(path)) return null

        return this._nodes.get(path).value
    }
}

export class JsonNode {
    path: string
    value: JSON.Value

    constructor(path: string, value: JSON.Value) {
        this.path = path
        this.value = value
    }

    isObject(): bool {
        return this.value.isObj
    }

    isArray(): bool {
        return this.value.isArr
    }

    children(): Array<JsonNode> {
        if(this.isObject()) return this.childrenObject()
        if(this.isArray()) return this.childrenArray()

        return new Array<JsonNode>(0);
    }

    private childrenObject(): Array<JsonNode> {
        const obj = <JSON.Obj>this.value

        const children: Array<JsonNode> = new Array<JsonNode>(obj.keys.length)

        for (let i = 0; i < obj.keys.length; i++) {
            const newPath: string = this.path.length > 0 ? this.path + "." + obj.keys[i] : obj.keys[i]
            children[i] = new JsonNode(newPath, <JSON.Value>obj.get(obj.keys[i]))
        }

        return children
    }

    private childrenArray(): Array<JsonNode> {
        const arr: JSON.Arr = <JSON.Arr>this.value

        const children: Array<JsonNode> = new Array<JsonNode>(arr._arr.length)

        for (let i = 0; i < arr._arr.length; i++) {
            const newPath: string = (this.path.length > 0 ? this.path : ".") + "[" + i.toString() + "]"
            children[i] = new JsonNode(newPath, arr._arr[i])
        }

        return children
    }
}
