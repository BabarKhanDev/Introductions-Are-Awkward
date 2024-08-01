# Game States

I describe the state of my game using a finite state machine.
That is as follows:

1. User login - Initial Game State
    Users are asked to input a username, when they select submit it is sent to the endpoint '/new_user' as a post request.
    The packet will be as follows:
    ```json
    {
      "username":<name>
    }
    ```
    This username is then checked against a database of connected users, 
    if the name exists then the client is sent back a fail message, 
    otherwise a success and the name is added to the database.
    Special case when the client is the first one to connect, they are then sent an initial_user message.
    That user can then tell the server to move into state 2 by getting the endpoint 'all_ready'.

2. Text Harvesting
    Users will ask the server for a prompt on the endpoint '/prompt_harvesting' it will return a question of the form:
    ```json
    {
      "prompt": <prompt>
    }
    ```
    The prompt will be a question that users should answer. These words are then harvested and stored in a bag of words.
    Each saved word in the bag of words is saved with the user who contributed it.
    Users have 1 minute to answer the prompt, if they submit their answer then they are given another prompt.

3. Making Introductions
    Users are given a prompt.
    For example: "<username> is the one who _",
    on the client you have to fill in the answer using words from a subset of the bag of words.

    The words that you can use are given over '/sample_bow'. It returns the following:
    ```json
    {
      "bow": str[]
    }
    ```
    The prompt is given over '/prompt_introduction'. It returns the following:
    ```json
    {
      "prompt": <prompt>
    }
    ```
    Users will submit their answer over '/submit_introduction'. 
    The server will then save:
    * The user who wrote the prompt
    * The number of words contributed to the bag of words that were used in this answer
    * The prompt
    * The answer

4. Guessing The Friend
    We then loop through each prompt, you are asked to guess which friend it is about.
    Scoring is done as follows:
   * You get one point if you guess the correct friend
   * You get one point for everybody who guesses your friend correctly, unless everyone guesses correctly, in which case you get 0.
   * You get 1 point if you used more than 3 peoples words in your answer.

5. Final Scores
    Once all prompts have been guessed we show scores