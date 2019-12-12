# CMSI-385-Final

Project: Implementation of a nondeterministic finite automaton(NFA) + a Turing Machine

Details: Using Node.js, I will carry out the instructions posted on Brightspace to create both a NFA Simulator and a Turing Machine Simulator by doing the following:

1. Accepting a machine description from either the (<) operator or via command line arguments
2. Validating the content of the description
3. Prompting for the string to be evaluated
4. Processing the string against the machine description
5. Prompting whether or not the string was accepted

Steps:

1. Write your formatted description to a .txt file and place it within the appropriate /descs directory
2. Execute

Execution commands:

- npm run nfastart
- npm run nfastart < descs/nfa/nfa0.txt
- npm run tmstart
- npm run tmstart < descs/tm/tm0.txt

Results:

- By default, the results are written to /descs/{type}/results.txt
- You can populate the environment variable "RESULTS_PATH" as well for a custom log path.

Important notes:

- _Please review descriptions to see how lambda transitions are handled._
- _If you are using the (<) operator to stream in descriptions, make sure to add an extra space after the last input string_
