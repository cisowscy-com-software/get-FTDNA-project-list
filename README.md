## How to instal it?
1) First download and install [Node.js >10](https://nodejs.org/en/) & [and optionally Console: Microsoft PowerShell-Core](https://docs.microsoft.com/pl-pl/powershell/scripting/install/installing-powershell?view=powershell-6) & [and optionally editor: Microsoft VSCode](https://code.visualstudio.com/download)
2) Create a folder anywhere on your computer and run the consoles there.and write the following lines in it, each time confirming them with an enterem
    -    ```PowerShell
         git clone https://github.com/cisowscy-com-software/haplo-ft-get.git
         ```
    -    ```PowerShell
         cd haplo-ft-get
         ```
    -    ```PowerShell
         npm i
         ```

![alt text][logo]

## How to cofigure it?

- SET USER&PASS -> open file `./config/USERNAME.txt`, `./config/PASSWORD.txt`, and put in your UserName & Password, and save it.
- SET MAX RAM -> open files `./config/RAMinMB.txt`, and change the default value of `6144` (6GB RAM) to another good one for your hardware, suggests no less than 3GB, or 50% of your RAM power.

## How to usage it?

1) For get links to all resultats of distribution haplogroup

    - Double-click on `./step_0_.cmd` and when it's finish and the window disappears by itself. Double-click on `./step_1_A_.cmd`, and `./step_1_B_.cmd`, etc.

    The first command retrieves the pagination of the alphabetical index, the second one for everyone a single element, retrieves and checks all the links needed to retrieve the content. The first process will last up to a minute, the second, even a few hours. Depends on computer performance, internet speed, and simultaneous different PC load.
    **The average speed of the script `./step_1_B_.cmd` in my case is 1432 projects per hour.**
    
2) in all next step follow the numbering and the alphabet
----------
## Anyone who wants to help in the development of grinding will be good seen :)

[logo]: ./doc/logo.jpg ""
