# Sequence Diagram

```
@startuml
op_arcade --> op_arcade_sdk: Play(session, tournament)
op_arcade_sdk <- Game: startAttempt()
op_arcade_sdk --> Game: confirmStart()
op_arcade_sdk <- Game: sendScore(score)
op_arcade <- op_arcade_sdk: PromptRestart()
@enduml
```

![Sequence Diagram](http://www.plantuml.com/plantuml/png/TSv1gi90383XVK-HvJnulK0HgIktOWzGGYT2iKbAabbuUnafeWKtWS37d_GUQ55uQNGTqIRC16rxXFSsUhvtS5dmaPpSPvL_22qco2Jnrtn1EBHmHgOENjbJ1F4QQQVgWOrDAhVPUAWw_OwHv65Ie-HrVhXgzg-QyXfNygtPa-J2onC0.png)