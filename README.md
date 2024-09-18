# TASK #3 (FOR ALL GROUPS)

In order not to be frightened by the **_Task #3_**, you must first understand why such an application can exist and how it will be used, what is its meaning. Without such an understanding, some requirements may seem alien to you, but it kinda makes sense.

So:

1. The player wants to play a **general non-transitive one-move game**. Not the Rock/Paper/Scissors, but any game he comes up with. The main idea is the non-transitivity of the moves (the second move wins over the first, the third wins over the second, but the third loses to the first). Accordingly, **no move can be hardcoded in the code**, moves are passed as arguments.

2. **The rules are determined solely by the moves order**, not by semantics. If a player wants to change the game rules, he changes the order of the passed moves.

3. The number of the moves can be arbitrary (e.g., when number increases, draw probability drop to zero).

4. The player wants to have **proof that the computer did not change its move** after the player's one. But at the same time, of course, the player wants to play "with interest", i.e. the player does not want to know and **_should not be able to calculate the computer's move prior to its move_**.

If this is clear, everything further is trivial and can be implemented in an hour or two.

Please note that the Task #3 is the last of the "console" tasks, which help us to learn som basic stuff (like requirements, hashes, HMACs, etc.), but starting from the Task #4 we'll move to the Web applications, which is the one of our major goals.

Using the language of your choice—from the Java/C#/PHP/JavaScript/TypeScript/Ruby/Python set, please—to write a script that implements a **generalized** rock-paper-scissors game (with the supports of arbitrary odd number of arbitrary combinations). Of course, it's recommended to use the language of your "specialization", but it's not required.

When launched with **_command line parameters_** (arguments to the main or Main method in the case of Java or C#, sys.argv in Python, process.argv in Node.js, etc.) it accepts an odd number ≥ 3 non-repeating strings (if the arguments are incorrect, you must display a neat error message—what exactly is wrong and an example of how to do it right). All messages should be in English. These passed strings are moves (for example, Rock Paper Scissors or Rock Paper Scissors Lizard Spock or 1 2 3 4 5 6 7 8 9).

Important: **_moves are passed as command line arguments_**, you don't parse them from the input stream (for example, a move may contain a space, but it shouldn't matter to your code).

The victory is defined as follows—half of the next moves in the circle wins, half of the previous moves in the circle lose (the semantics of the strings-moves is not important, he plays by the rules build upon the moves order the user used, even if the stone loses to scissors in its order—the contents of the strings-moves are not important for you).

The script generates a **_cryptographically strong random key_** (SecureRandom, RandomNumberGenerator, etc. - **mandatory**) with a length of **_at least 256 bits_**, makes own (computer's) move, calculates HMAC (based on SHA2 or SHA3) from the own move as a message with the generated key, displays the HMAC to the user. After that the user gets "menu" 1 - Stone, 2 - Scissors, ...., 0 - Exit. The user makes his choice (in case of incorrect input, the "menu" is displayed again). The script shows who won, the move of the computer and the original key.

Re-read the paragraph above, the sequence is critical (it simply doesn't make sense to do it differently, for example, showing the key before the user's turn or HMAC instead of the key).

Thus the user can check that the computer plays fair (did not change its move after the user's move).

When you select the "help" option in the terminal, you need to display a table (ASCII-graphic) that determines which move wins.

The table generation should be in a separate class, the definition of the "rules" who won should be in a separate class, the key generation and HMAC functions should be in a separate class (at least 4 classes in total). You should use the core class libraries and third-party libraries to the maximum, and not reinvent the wheel. Help should be formatted as an N + 1 by N + 1 table, where N is the number of moves (determined by the number of arguments passed to the script). +1 to add a title for the rows and a title for the columns (contain the title of the move). Cells can contain Win/Lose/Draw.

THE NUMBER OF MOVES CAN BE ARBITRARY (odd and > 1, depending on the passed parameters), it is not hardwired into the code.

## Example:

```
>java -jar game.jar rock Spock paper lizard scissors
HMAC: 9ED68097B2D5D9A968E85BD7094C75D00F96680DC43CDD6918168A8F50DE8507
Available moves:
1 - rock
2 - Spock
3 - paper
4 - lizard
5 - scissors
0 - exit
? - help
Enter your move: 3
Your move: paper
Computer move: rock
You win!
HMAC key: BD9BE48334BB9C5EC263953DA54727F707E95544739FCE7359C267E734E380A2
```

And as an explanation: when calculating HMAC, the key is the same secret key that you generated. And the message is a move string. After own move the user obtains a key and the computer's move& And the user will be able to calculate the HMAC and compare with the HMAC that was shown before the user's move. It's not very difficult 🙂

A common mistake is trying to invent your "HMAC" as a hash of a random "key". This will not work. If you show the same lines before the move and after the move, the user does not receive new information after the move and, accordingly, you do not prove anything to him. It is necessary to generate a key (with a secure generator), make a computer move, calculate HMAC (by a standard algorithm) from a computer move (message) and a key (key), show HMAC, get a user move, show a key. Re-read this paragraph until the total comprehension.

The example of the "correct" order (although the user may use a different order and play a game of scissors defeating rock; or play a game of MOVE1 MOVE2 MOVE3): STONE PAPER SCISSORS or STONE SPOCK PAPER LIZARD SCISSORS.

What is this task for? You need to understand hash function a little bit deeper, understand whay they are for, add HMAC idea, learn to think how the exact sequence of steps can give you some kind of prove or contract, work with external libraries, touch some basics of OOP and a few other things.

## More information

How to improve usability of the console help table (make it more understandable).
First of all, you may render header row with some emphasis. E.g. use some color.
Second, you may replace "PC Moves" header with something more complex, like this:

```
+-------------+------+-------+----------+
| v PC\User > | Rock | Paper | Scissors |
+-------------+------+-------+----------+
| Rock        | Draw | Win   | Lose     |
+-------------+------+-------+----------+
| Paper       | Lose | Draw  | Win      |
+-------------+------+-------+----------+
| Scissors    | Win  | Lose  | Draw     |
+-------------+------+-------+----------+
```

And, the last, but not least, you may _add some text before the table_ (e.g. state that the results are from user point of view and add, well, example).

Here is another example of the help table:

```
+-------------+------+-------+----------+------+------+
| v PC\User > | Rock | Paper | 3rd move | 4th  | 5th  |
+-------------+------+-------+----------+------+------+
| Rock        | Draw | Win   | Win      | Lose | Lose |
+-------------+------+-------+----------+------+------+
| Paper       | Lose | Draw  | Win      | Win  | Lose |
+-------------+------+-------+----------+------+------+
| 3rd move    | Lose | Lose  | Draw     | Win  | Win  |
+-------------+------+-------+----------+------+------+
| 4th         | Win  | Lose  | Lose     | Draw | Win  |
+-------------+------+-------+----------+------+------+
| 5th         | Win  | Win   | Lose     | Lose | Draw |
+-------------+------+-------+----------+------+------+
```

And for 7:

```
+-------------+------+-------+----------+------+------+------+------+
| v PC\User > | Rock | Paper | 3rd move | 4th  | 5th  | 6th  | 7th  |
+-------------+------+-------+----------+------+------+------+------+
| Rock        | Draw | Win   | Win      | Win  | Lose | Lose | Lose |
+-------------+------+-------+----------+------+------+------+------+
| Paper       | Lose | Draw  | Win      | Win  | Win  | Lose | Lose |
+-------------+------+-------+----------+------+------+------+------+
| 3rd move    | Lose | Lose  | Draw     | Win  | Win  | Win  | Lose |
+-------------+------+-------+----------+------+------+------+------+
| 4th         | Lose | Lose  | Lose     | Draw | Win  | Win  | Win  |
+-------------+------+-------+----------+------+------+------+------+
| 5th         | Win  | Lose  | Lose     | Lose | Draw | Win  | Win  |
+-------------+------+-------+----------+------+------+------+------+
| 6th         | Win  | Win   | Lose     | Lose | Lose | Draw | Win  |
+-------------+------+-------+----------+------+------+------+------+
| 7th         | Win  | Win   | Win      | Lose | Lose | Lose | Draw |
+-------------+------+-------+----------+------+------+------+------+
```

And so on (you need to support any odd move number). Of course, for large values it would be nice to implement some kind of pagination, but it's out of the scope of the basic task (you may consider it as an optional "for the highest grade" problem).
