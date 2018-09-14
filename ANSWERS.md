<!-- Answers to the Short Answer Essay Questions go here -->

1. What is the purpose of using _sessions_?
   storing user info state - persist info across requests
2. What does bcrypt do to help us store passwords in a secure manner.
   bcrypt doesnt store them as plain text by hashing the password.
3. What does bcrypt do to slow down attackers?
   hashes multiple times based on amount, increasing the amount of specific info an attacker would have to know
4. What are the three parts of the JSON Web Token?
   Header- type of token and hashing algorithm,
   Payload: CLaims about user and data,
   Signature
