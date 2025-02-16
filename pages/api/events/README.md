was möchte ich erreochen:

ich möchte, dass man per api nahezu beliebig viele events per post an diesen service senden kann.
dazu soll der endpunkt zwi funktionen haben:
- einen einzelnen event per POST epfangen
- eine liste von events per POST empfangen

die events sollen zunächst in eine queue geschrieben werden, die dann von einem worker abgearbeitet wird.


was brauche ich dazu:

- eine api, die eine liste von events entgegennehmen kann
- eine api, die einen einzelnen event entgegennehmen kann
- eine queue, die die events aufnimmt
- einen worker, der die events aus der queue abarbeitet

