export function noop() {}

export function safe_eq(x: any, y: any) {
    if (x === y) return true
    if (
        (typeof x == 'object' && x != null) &&
        (typeof y == 'object' && y != null)
    ) {
        if (Object.keys(x).length != Object.keys(y).length) return false
        for (const prop in x) {
            if (Object.hasOwnProperty.call(x, prop) && Object.hasOwnProperty.call(y, prop)) {
                if (!safe_eq(x[prop], y[prop])) return false
            } else return false
        }
        return true
    }
    return false
}



export function diffNodes<TNode, UNode>(ctx:{
    areSameNodes: (currentNode: TNode, newNode: UNode) => boolean,
    createNode: (newNode: UNode) => void,
    updateeNode: (currentNode: TNode, newNode: UNode) => void,
    moveNode: (currentNode: TNode) => void,
    removeNode: (currentNode: TNode) => void,
}, currentChildren: TNode[], newChildren: UNode[]) {
    let discard: TNode[] = []
    for (const item of currentChildren) {
        if (newChildren.length == 0) {
            discard = [...discard, item]
        } else if (!ctx.areSameNodes(item, newChildren[0])) {
            discard = [...discard, item]
        } else {
            ctx.updateeNode(item, newChildren[0])
            newChildren = newChildren.slice(1)
        }
    }
    for (const item of newChildren) {
        if (discard.some(discarded => ctx.areSameNodes(discarded, item))) {
            const idx = discard.findIndex(discarded => ctx.areSameNodes(discarded, item))
            ctx.moveNode(discard[idx])
            discard = discard.filter((_, i) => i != idx)
        } else {
            ctx.createNode(item)
        }
    }
    discard.forEach(discarded => ctx.removeNode(discarded))
}