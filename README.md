# GM

To test me:

## Hardhat

Launch from /hardhat
`yarn install`
`yarn chain`
`yarn deploy`

in your metamask use Account 0

address `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`

private key `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`


## Backend

Launch from /backend
`yarn install`

fill your .env with needed values.
```
DATABASE_URL="mysql://root:adminadmin@localhost:3306/towerz"

LANDZ_CONTRACT="0x5FbDB2315678afecb367f032d93F642f64180aa3"
TOWERZ_CONTRACT="0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
GAMEZ_CONTRACT="0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
```
you need to create yourself a local mysql db if you want to test the project.

and replace the contracts address with the values obtained during contract deploy previously.

if you made it till here run:

`yarn pgenerate`

`yarn pmigrate`

`yarn start`

at this point your server might be running.


## Game

Launch from /game

`yarn install`
```
NEXT_PUBLIC_LAND_CONTRACT="0x5fbdb2315678afecb367f032d93f642f64180aa3"
NEXT_PUBLIC_TOWERZ_CONTRACT="0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
NEXT_PUBLIC_SHOP_CONTRACT="0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
NEXT_PUBLIC_GAMEZ_CONTRACT="0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
```

Fill the .env with contract values previously deployed then

`yarn dev`


And voila. everything should be running.