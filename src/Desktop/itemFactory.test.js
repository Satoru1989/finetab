import ItemFactory from "./itemFactory";
import Link from "./Items/Links/link";
import TestItem from "./Items/testItem";

describe('itemFactory suite', () => {
    test( 'Correct component should be retured with associated class ', () => {
        let itemFactory = new ItemFactory();

        let linkJson = {name: "link", data: {word: 'fox'}};

        let res = itemFactory.getItemAsComponent(linkJson, 0);        
        let link = res.props.children;

        expect(res.key).toBe('1');
        expect(link.type).toBe(Link);
        expect(link.props.data).toStrictEqual(linkJson.data);
        
        let testItemJson = {name: "testItem", data: { word: 'fox' }};
        res = itemFactory.getItemAsComponent(testItemJson, 1);
        let testItem = res.props.children;

        expect(res.key).toBe('2');
        expect(testItem.type).toBe(TestItem);
        expect(testItem.props.data).toStrictEqual(testItemJson.data);
    });

});