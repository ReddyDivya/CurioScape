//createClient function is used to create a client instance that can interact with the Sanity.io API
import { createClient } from '@sanity/client';

//imageUrlBuilder function is used to create an image URL builder instance, which helps in constructing URLs for images stored in your Sanity.io project
import imageUrlBuilder from '@sanity/image-url';

/*
- creates a client instance using the createClient function. 
- The createClient function takes an object with various configuration options as an argument.
*/
export const client = createClient({

  //options
  //process.env => environment variables
  projectId : 'x8qy9fhj',
  dataset:'production',
  apiVersion:'2023-06-08',
  useCdn:true,
  token:'skiY7gkB136qlWccUiwH7exysNSJjyVwkbv0VTHXjkLf31Xmliav8zHUhVEh5M22wut6UsQZ3KkQdlU9v1h1bmkgceG55An5Dd3QJdnaGlAVphdEzNiOmKFBLFLmTteTyNLaEt9Mvcr0YaBv40ThEn4f7GMFLxr0JIoTg7PCnqbCPnxHkeZI',
})

//creates an image URL builder instance by invoking the imageUrlBuilder function and passing in the client instance created in the previous step.
const builder = imageUrlBuilder(client);

//named export 'urlFor', which is a function that takes a source argument representing the image asset or reference in your Sanity.io project
export const urlFor = (source) => builder.image(source);

/*
Note:
When called, the urlFor function utilizes the builder instance to generate the URL for the specified image source. 
The generated URL can be used to display or manipulate the image in your React application.
*/
