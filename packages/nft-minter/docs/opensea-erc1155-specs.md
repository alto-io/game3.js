### ERC1155 Token

**Contract Uri**: Shows the token info on Opensea

**example**: https://creatures-api.opensea.io/contract/opensea-erc1155


```
{
  "description": "Fun and useful accessories for your OpenSea creatures.", 
  "external_link": "https://github.com/ProjectOpenSea/opensea-erc1155/", <-- link to Website button in opensea webpage
  "image": "https://example.com/image.png", 
  "name": "OpenSea Creature Accessories"
}
```

**BaseMetadataUri:** Gets metadata given a token id

**Base:** https://creatures-api.opensea.io/api/creature/

**example token:** https://creatures-api.opensea.io/api/creature/1

```
{
  "attributes": [
    {
      "trait_type": "Base", 
      "value": "starfish"
    }, 
    {
      "trait_type": "Eyes", 
      "value": "joy"
    }, 
    {
      "trait_type": "Mouth", 
      "value": "surprised"
    }, 
    {
      "trait_type": "Level", 
      "value": 2
    }, 
    {
      "trait_type": "Stamina", 
      "value": 2.3
    }, 
    {
      "trait_type": "Personality", 
      "value": "Sad"
    }, 
    {
      "display_type": "boost_number", 
      "trait_type": "Aqua Power", 
      "value": 40
    }, 
    {
      "display_type": "boost_percentage", 
      "trait_type": "Stamina Increase", 
      "value": 10
    }, 
    {
      "display_type": "number", 
      "trait_type": "Generation", 
      "value": 2
    }
  ], 
  "description": "Friendly OpenSea Creature that enjoys long swims in the ocean.", 
  "external_url": "https://openseacreatures.io/1", 
  "image": "https://storage.googleapis.com/opensea-prod.appspot.com/creature/1.png", 
  "name": "Sprinkles Fisherton"
}
```
