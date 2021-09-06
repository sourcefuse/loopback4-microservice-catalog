# Added/Editing Environment Variables

- To make any changes in the env vars that the application will use please edit the deployment.yaml file in this folder
- Only the values listed in deployment.yaml will be added as part of the application
- To edit an env var replace the value associated with it. Example, lets say you want to update PROJECT_MGT_API_URL with the latest url:

&ensp;&ensp;&ensp;&ensp;-- old value

  &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;`name: PROJECT_MGT_API_URL`
  
  &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;`value: 'https://proj-mgt-pms-dev.sourcef.us'`
   
&ensp;&ensp;&ensp;&ensp;-- new value

  &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;`name: PROJECT_MGT_API_URL`
  
  &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;`value: 'https://proj-mgt-pms-dev-2.sourcef.us'`
  
- To add a new env var create a new name:value pair and add it to the end of the `env` section of the file. Example:

&ensp;&ensp;&ensp;&ensp;-- old value

   &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;`env:`
   
   &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; &ensp;&ensp;-&ensp;&ensp; `name: PROJECT_MGT_API_URL`
   
   &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; `value: 'https://proj-mgt-pms-dev.sourcef.us'`
   
&ensp;&ensp;&ensp;&ensp;-- new value
   
   &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;`env:`
   
   &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;-&ensp;&ensp; `name: PROJECT_MGT_API_URL`
   
   &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; `value: 'https://chat-svc-dev.example.com'`
   
   &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;-&ensp;&ensp; `name: CHAT_API_URL`
   
   &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; `value: 'https://chat-svc-dev.example.com'`
