Getting Started
Installation
npm
pnpm
yarn
bun

npm i @better-fetch/fetch
If you plan to use runtime validation, you need to install standard schema compliant validator like zod, valibot, arktype and so on.

npm
pnpm
yarn
bun

npm i zod # valibot, arktype...
Quick Start
The fastest way to start using Better Fetch is to import the betterFetch function. You can define the response type using generics or use a schema that supports Standard Schema (recommended).

fetch.ts

import { betterFetch } from '@better-fetch/fetch';
 
// Using generic type
const { data, error } = await betterFetch<{
    userId: string;
    id: number;
    title: string;
    completed: boolean;
}>("https://jsonplaceholder.typicode.com/todos/1");
 
 
// Using a Standard Schema validator (for example, zod)
import { z } from 'zod'; // or your preferred Standard Schema compliant library
 
const { data: todos, error: todoError } = await betterFetch("https://jsonplaceholder.typicode.com/todos/1", {
    output: z.object({
        userId: z.string(),
        id: z.number(),
        title: z.string(),
        completed: z.boolean(),
    })  
});
 
Hover over the data object to see the type
Make sure strict mode is enabled in your tsconfig when using schema validations.

Better fetch by default returns a Promise that resolves to an object of data and error but if you pass the throw option, it will return the parsed response data only.

Create Fetch
Create Fetch allows you to create a better fetch instance with custom configurations.

fetch.ts

import { createFetch } from "@better-fetch/fetch";
 
export const $fetch = createFetch({
  baseURL: "https://jsonplaceholder.typicode.com",
  retry: {
      type: "linear",
      attempts: 3,
      delay: 1000 
  }
});
 
const { data, error } = await $fetch<{
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}>("/todos/1");
You can pass more options see the Fetch Options section for more details.

Throwing Errors
You can throw errors instead of returning them by passing the throw option.

If you pass the throw option, the betterFetch function will throw an error. And instead of returning data and error object it'll only the response data as it is.

fetch.ts

import { createFetch } from '@better-fetch/fetch';
import { z } from 'zod';
 
const $fetch = createFetch({
    baseURL: "https://jsonplaceholder.typicode.com",
    throw: true,
});
 
const data = await $fetch<{
    userId: number;
}>("https://jsonplaceholder.typicode.com/todos/1");
Learn more about handling errors Handling Errors section.

Fetch Schema
Fetch schema enables you to pre-define the URL path and the shape of request and response data. This makes it easy to document your API.

Plugins can also define fetch schemas. See Plugins section for more details.

The output of the schema will be validated using your schema and if the validation fails, it'll throw an error.

fetch.ts

import { createSchema, createFetch } from "@better-fetch/fetch";
 
// ZOD example
import { z } from "zod";
 
export const zodSchema = createSchema({ 
    "/path": { 
        input: z.object({ 
            userId: z.string(), 
            id: z.number(), 
            title: z.string(), 
            completed: z.boolean(), 
        }), 
        output: z.object({ 
            userId: z.string(), 
            id: z.number(), 
            title: z.string(), 
            completed: z.boolean(), 
        }), 
    } 
}) 
 
const $fetch = createFetch({
    baseURL: "https://jsonplaceholder.typicode.com",
    schema: zodSchema 
});
 
const { data, error } = await $fetch("/path", {
    body: {
        userId: "1",
        id: 1,
        title: "title",
        completed: true,
    },
});
Learn more about fetch schema Fetch Schema section


Handling Errors
Default Error Type
Better fetch by default returns response errors as a value. By defaullt, the error object has 3 properties status, statusText and message properties.

status and statusText are always defined. If the api returns a json error object it will be parsed and returned with the error object. By default error includes message property that can be string or undefined.

fetch.ts

import { betterFetch } from '@better-fetch/fetch';
import { z } from 'zod';
 
const { error } = await betterFetch("https://jsonplaceholder.typicode.com/todos/1");
 
Hover over the error object to see the type
Custom Error Type
You can pass a custom error type to be inferred as a second generic argument.


import { betterFetch } from 'better-fetch';
 
const { error } = await betterFetch<{
    id: number;
    userId: string;
    title: string;
    completed: boolean;
}, 
{ 
    message?: string; 
    error?: string;
}>("https://jsonplaceholder.typicode.com/todos/1");
If you pass a custom error type, it will override the default error type except for the status and statusText properties. If you still need the message property, you need to include it in your custom error type.

Throwing Errors
If you prefer to throw errors instead of returning them, you can use the throw option.

When you pass the throw option, the betterFetch function will throw an error. And instead of returning data and error object it'll only the response data as it is.

fetch.ts

import { betterFetch } from '@better-fetch/fetch';
import { z } from 'zod';
 
const data = await betterFetch("https://jsonplaceholder.typicode.com/todos/1", {
    throw: true, 
    output: z.object({  
        userId: z.string(),
        id: z.number(),
        title: z.string(),
        completed: z.boolean(),
    }),
});
Inferring Response When Using Generics and throw Option
When you pass the throw option to the betterFetch function, it will throw an error instead of returning it. This means the error will not be returned as a value. However, if you specify the response type as a generic, the error object will still be returned, and data will be inferred as possibly null or the specified type. This issue arises because the throw option cannot be inferred when a generic value is passed, due to a TypeScript limitation.

To address this, you have two options. If you use either option, the error object will no longer exist, and the response type will be inferred correctly without being unioned with null.

Create a custom fetch instance with the throw option.
fetch.ts

import { createFetch } from "@better-fetch/fetch";
 
export const $fetch = createFetch({
  baseURL: "https://jsonplaceholder.typicode.com",
  retry: 2,
  throw: true,
}); 
 
 
const data = await $fetch<{
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}>("/todos/1");
Pass false as a second generic argument to the betterFetch function.
fetch.ts

import { betterFetch } from '@better-fetch/fetch';
import { z } from 'zod';
 
const data = await betterFetch<{
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}, 
false
>("https://jsonplaceholder.typicode.com/todos/1");

Authorization
Authorization is a way that allows you to add authentication headers to the request. Currently, supports Bearer and Basic authorization.

Bearer
The bearer authorization is used to add a bearer token to the request. The token is added to the Authorization header.

fetch.ts

import { createFetch } from "@better-fetch/fetch";
 
const $fetch = createFetch({
    baseURL: "http://localhost:3000",
    auth: {
        type: "Bearer",
        token: "my-token",
    },
})
You can also pass a function that returns a string.

fetch.ts

const $fetch = createFetch({
    baseURL: "http://localhost:3000",
    auth: {
        type: "Bearer",
        token: () => authStore.getToken(),
    },
})
The function will be called only once when the request is made. If it returns undefined, the header will not be added to the request.

Basic
The basic authorization is used to add a basic authentication to the request. The username and password are added to the Authorization header.

fetch.ts

import { createFetch } from "@better-fetch/fetch";
 
const $fetch = createFetch({
    baseURL: "http://localhost:3000",
    auth: {
        type: "Basic",
        username: "my-username",
        password: "my-password",
    },
})

Dynamic Parameters
Dynamic parameters are parameters that are defined in the url path. They are defined using the : prefix. When the request is made, the dynamic parameters will be replaced with the values passed in the params option.

fetch.ts

import { createFetch } from "@better-fetch/fetch";
 
const $fetch = createFetch({
    baseURL: "http://localhost:3000",
})
 
const res = await $fetch("/path/:id", {
    params: {
        id: "1"
    }
})
 
const res2 = await $fetch("/repos/:owner/:repo", {
    params: {
        owner: "octocat",
        repo: "hello-world"
    }
})

Timeout and Retry
Timeout and retry are two options that can be used to control the request timeout and retry behavior.

Timeout
You can set the timeout in milliseconds.

fetch.ts

const res = await $fetch("/api/users", {
    timeout: 10000,
});
Auto Retry
You can set the retry count and interval in milliseconds.

fetch.ts

const res = await $fetch("/api/users", {
    retry: 3
});
Advanced Retry Options
Better fetch provides flexible retry mechanisms with both linear and exponential backoff strategies. You can customize the retry behavior to suit your specific needs.

Basic retry with number of attempts:

fetch.ts

const res = await $fetch("https://jsonplaceholder.typicode.com/todos/1", {
  retry: 3
});
Linear retry strategy:

fetch.ts

const res = await $fetch("https://jsonplaceholder.typicode.com/todos/1", {
  retry: {
    type: "linear",
    attempts: 3,
    delay: 1000 // 1 second delay between each attempt
  }
});
Exponential backoff strategy:

fetch.ts

const res = await $fetch("https://jsonplaceholder.typicode.com/todos/1", {
    retry: {
        count: 3,
        interval: 1000, //optional
    type: "exponential",
    attempts: 5,
    baseDelay: 1000, // Start with 1 second delay
    maxDelay: 10000 // Cap the delay at 10 seconds, so requests would go out after 1s then 2s, 4s, 8s, 10s
  }
});
Custom retry condition:

fetch.ts

const res = await $fetch("https://jsonplaceholder.typicode.com/todos/1", {
  retry: {
    type: "linear",
    attempts: 3,
    delay: 1000,
    shouldRetry: (response) => {
      if(response === null) return true; 
      if(response.status === 429) return true;
      if(response.status !== 200) return true;
      return response.json().then(
        data => data.completed === false
      ).catch(
        err => true 
      )
    }
  }
});
Retry with callback:

fetch.ts

const res = await $fetch("https://jsonplaceholder.typicode.com/todos/1", {
  retry: 3,
  onRetry: (response) => {
    console.log(`Retrying request.`);
    }
});

Fetch Schema
Fetch schema allows you to pre-define the URL path and the shape of request and response data. You can easily document your API using this schema.

Better Fetch now uses Standard Schema internally, allowing you to bring your own Standard Schema-compliant validator (e.g., Zod, Valibot, ArkType).

To create a fetch schema, you need to import the createSchema function from @better-fetch/fetch.

npm
pnpm
yarn
bun

npm i zod
To create a fetch schema, you need to import the createSchema function from @better-fetch/fetch.

fetch.ts

import { createSchema, createFetch } from "@better-fetch/fetch";
import { z } from "zod";
 
export const schema = createSchema({ 
    "/path": { 
        input: z.object({ 
            userId: z.string(), 
            id: z.number(), 
            title: z.string(), 
            completed: z.boolean(), 
        }), 
        output: z.object({ 
            userId: z.string(), 
            id: z.number(), 
            title: z.string(), 
            completed: z.boolean(), 
        }), 
    } 
}) 
 
const $fetch = createFetch({
    baseURL: "https://jsonplaceholder.typicode.com",
    schema: schema 
});
Fetch Schema
The Fetch Schema is a map of path/url and schema. The path is the url path and the schema is an object with input, output, query and params keys.

The input key is the schema of the request data. The output key is the schema of the response data. The query key is the schema of the query params. The params key is dynamic path parameters.

Input
The input schema is the schema of the request data. The input key is the schema of the request data. If you defined an input schema, the data will be required to be passed as a body of the request.

If you define an input schema, a post method will be used to make the request and if there is no input schema, a get method will be used. See method modifiers section for defining specific methods.

fetch.ts

import { createFetch, createSchema } from "@better-fetch/fetch";
import { z } from "zod";
 
const $fetch = createFetch({
    baseURL: "https://jsonplaceholder.typicode.com",
    schema: createSchema({
        "/path": {
            input: z.object({
                userId: z.string(),
                id: z.number(),
                title: z.string(),
                completed: z.boolean(),
            }),
        },
    }), 
})
 
const { data, error } = await $fetch("/path", {
    body: {}
Type '{}' is missing the following properties from type '{ userId: string; id: number; title: string; completed: boolean; }': userId, id, title, completed
})
To make the body optional you can wrap the schema with z.optional.

Output
The output key is the schema of the response data. If you defined an output schema, the data will be returned as the response body.

fetch.ts

import { createFetch, createSchema } from "@better-fetch/fetch";
import { z } from "zod";
 
const $fetch = createFetch({
    baseURL: "https://jsonplaceholder.typicode.com",
    schema: createSchema({
        "/path": {
            output: z.object({
                userId: z.string(),
                id: z.number(),
                title: z.string(),
                completed: z.boolean(),
            }),
        },
    }), 
})
 
const { data, error } = await $fetch("/path")
 
Hover over the data object to see the type
Query
The query schema is the schema of the query params. The query key is the schema of the query params. If you defined a query schema, the data will be passed as the query params.

fetch.ts

import { createFetch, createSchema } from "@better-fetch/fetch";
import { z } from "zod";
 
const $fetch = createFetch({
    baseURL: "https://jsonplaceholder.typicode.com",
    schema: createSchema({
        "/path": {
            query: z.object({
                userId: z.string(),
                id: z.number(),
                title: z.string(),
                completed: z.boolean(),
            }),
        },
    }), 
})
 
const { data, error } = await $fetch("/path", {  
    query: {}
Type '{}' is missing the following properties from type '{ userId: string; id: number; title: string; completed: boolean; }': userId, id, title, completed
})
 
Hover over the data object to see the type
Dynamic Path Parameters
The params schema is the schema of the path params. You can either use the params key to define the paramters or prepend : to the path to make the parameters dynamic.

If you define more than one dynamic path parameter using the string modifier the paramters will be required to be passed as an array of values in the order they are defined.

fetch.ts

import { createFetch, createSchema } from "@better-fetch/fetch";
import { z } from "zod";    
 
const schema = createSchema({
    "/user/:id": {
        output: z.object({
            name: z.string(),
        }),
    },
    "/post": {
        params: z.object({
            id: z.string(),
            title: z.string(),
        }),
    },
    "/post/:id/:title": {
        output: z.object({
            title: z.string(),
        }),
    }
}) 
 
 
const $fetch = createFetch({
    baseURL: "https://jsonplaceholder.typicode.com",
    schema: schema
})
 
const response1 = await $fetch("/user/:id", {
    params: {
        id: "1",
    }
})
 
const response2 = await $fetch("/post", {
    params: {
        id: "1",
        title: "title"
    },
})
 
const response3 = await $fetch("/post/:id/:title", {
    params: {
        id: "1",
        title: "title"
    }
})
Method Modifiers
By default the get and post methods are used to make the request based on whether the input schema is defined or not. You can use the method modifier to define the method to be used.

The method modifiers are @get, @post, @put, @patch, @delete and @head. You prepend the method name to the path to define the method.

fetch.ts

import { createFetch, createSchema } from "@better-fetch/fetch";
import { z } from "zod";
 
const $fetch = createFetch({
    baseURL: "https://jsonplaceholder.typicode.com",
    schema: createSchema({
        "@put/user": { 
            input: z.object({
                title: z.string(),
                completed: z.boolean(),
            }),
            output: z.object({
               title: z.string(),
               completed: z.boolean(),
            }),
        },
    }), 
})
 
const { data, error } = await $fetch("/@put/user", {
    body: {
        title: "title",
        completed: true,
    }
})
 
the request will be made to "/user" path with a PUT method.
Strict Schema
By default if you define schema better fetch still allows you to make a call to other routes that's not defined on the schema. If you want to enforce only the keys defined to be inferred as valid you can use pass the strict option to the schema.

fetch.ts

import { createFetch, createSchema } from "@better-fetch/fetch";
import { z } from "zod";
 
const $fetch = createFetch({
    baseURL: "https://jsonplaceholder.typicode.com",
    schema: createSchema({
        "/path": {
            output: z.object({
                userId: z.string(),
                id: z.number(),
                title: z.string(),
                completed: z.boolean(),
            }),
        },
    }, 
    { 
        strict: true
    }), 
})
const { data, error } = await $fetch("/invalid-path")
Argument of type '"/invalid-path"' is not assignable to parameter of type '"/path"

Default Types
Default Output
By default, the response data will always be of type unknown. If you want to customize the default type you can pass the defaultOutput option to the createFetch function. Note: When you supply a custom output schema using a Standard Schema validator (for example, zod or any alternative), the provided output schema will override the defaultOutput type. This approach offers a strongly typed solution without locking you to a single library.

This only serves as a type for the response data it's not used as a validation schema.

fetch.ts

import { createFetch } from "@better-fetch/fetch";
// Example using zod (or any Standard Schema compliant library)
import { z } from "zod"; 
 
const $fetch = createFetch({
    baseURL: "https://jsonplaceholder.typicode.com",
    defaultOutput: z.any(),
})
 
const { data, error } = await $fetch("/todos/1")
 
 
Hover over the data object to see the type
If you define output schema, the default output type will be ignored.

fetch.ts

import { createFetch } from "@better-fetch/fetch";
import { z } from "zod";
 
const $fetch = createFetch({
    baseURL: "https://jsonplaceholder.typicode.com",
    defaultOutput: z.any(),
});
 
const { data, error } = await $fetch("/todos/1", {
    output: z.object({
        userId: z.string(),
        id: z.number(),
        title: z.string(),
        completed: z.boolean(),
    }),
})
 
Hover over the data object to see the type
Default error
The default error type is:


{ status: number, statusText: string, message?: string }
If you want a custom error type, you can pass a defaultError option to the createFetch function. Remember: Your custom error type builds on top of the default properties, and if your API returns a JSON error, // it will be merged with your definition.

The status and statusText properties are always defined. Your custom error definitions are only inferred if the API returns a JSON error object.

fetch.ts

import { createFetch } from "@better-fetch/fetch";
import { z } from "zod"; // Example only
 
const $fetch = createFetch({
    baseURL: "https://jsonplaceholder.typicode.com",
    defaultError: z.object({
        message: z.string().optional(),
        error: z.string(),
    }),
})
 
const { data, error } = await $fetch("/todos/1")
 
Hover over the error object to see the type

Hooks
Hooks are functions that are called at different stages of the request lifecycle.

fetch.ts

import { createFetch } from "@better-fetch/fetch";
 
const $fetch = createFetch({
    baseURL: "http://localhost:3000",
    onRequest(context) {
        return context;
    },
    onResponse(context) {
        return context.response
    },
    onError(context) {
    },
    onSuccess(context) {
    },
})
On Request
a callback function that will be called when a request is about to be made. The function will be called with the request context as an argument and it's expected to return the modified request context.

fetch.ts

import { createFetch } from "@better-fetch/fetch";
 
const $fetch = createFetch({
    baseURL: "http://localhost:3000",
    onRequest(context) {
        // do something with the context
        return context;
    },
})
On Response
a callback function that will be called when a response is received. The function will be called with the response context which includes the response and the requestContext as an argument and it's expected to return response.

fetch.ts

import { createFetch } from "@better-fetch/fetch";
 
const $fetch = createFetch({
    baseURL: "http://localhost:3000",
    onResponse(context) {        
        // do something with the context
        return context.response // return the response
    },
})
On Success and On Error
on success and on error are callbacks that will be called when a request is successful or when an error occurs. The function will be called with the response context as an argument and it's not expeceted to return anything.

fetch.ts

import { createFetch } from "@better-fetch/fetch";
 
const $fetch = createFetch({
    baseURL: "http://localhost:3000",
    onSuccess(context) {
        // do something with the context
    },
    onError(context) {
        // do something with the context
    },
})

Plugins
Plugins are functions that can be used to modify the request, response, error and other parts of the request lifecycle and can be used to define Fetch Schema.

Init
The init function is called before the request is made and any of the internal functions are called. It takes the url and options as arguments and is expected to return the modified url and options.

fetch.ts

import { createFetch, BetterFetchPlugin } from "@better-fetch/fetch";
 
const myPlugin = {
    id: "my-plugin",
    name: "My Plugin",
    init: async (url, options) => {
       if(url.startsWith("http://")) {
           const _url = new URL(url)
           const DEV_URL = "http://localhost:3000"
           return {
               url: `${DEV_URL}/${_url.pathname}`,
               options,
           }
       }
        return {
            url,
            options,
        }
    },
} satisfies BetterFetchPlugin;
 
const $fetch = createFetch({
    baseURL: "https://jsonplaceholder.typicode.com",
    plugins: [myPlugin],
});
Hooks
Hooks are functions that are called at different stages of the request lifecycle. See Hooks for more information.

fetch.ts

import { createFetch, BetterFetchPlugin } from "@better-fetch/fetch";
 
const myPlugin = {
    id: "my-plugin",
    name: "My Plugin",
    hooks: {
        onRequest(context) {
        // do something with the context
        return context;
        },
        onResponse(context) {
            // do something with the context
            return context;
        },
        onError(context) {
            // do something with the context
        },
        onSuccess(context) {
            // do something with the context
        },
    }
} satisfies BetterFetchPlugin;
 
const $fetch = createFetch({
    baseURL: "https://jsonplaceholder.typicode.com",
    plugins: [myPlugin],
});
If more than one plugin is registered, the hooks will be called in the order they are registered.

Schema
You can define a schema for a plugin. This allows you to easily document the API usage using a schema. The schema is now based on the Standard Schema specification.

Note: Better Fetch now uses Standard Schema internally so you can bring your own Standard Schema–compliant validator. You are no longer limited to zod.

fetch.ts

import { createFetch, createSchema, BetterFetchPlugin } from "@better-fetch/fetch";
// Example using zod (or any Standard Schema compliant validator)
import { z } from "zod";
const plugin = {
    id: "my-plugin",
    name: "My Plugin",
    schema: createSchema({
            "/path": {
                input: z.object({
                    /**
                     * You can write descriptions for the properties. Hover over the property to see 
                     * the description.
                     */
                    userId: z.string(),
                    /**
                     * The id property is required
                     */
                    id: z.number(),
                }),
                output: z.object({
                    title: z.string(),
                    completed: z.boolean(),
                }),
            }
        },{
            baseURL: "https://jsonplaceholder.typicode.com",
        })
} satisfies BetterFetchPlugin;
 
const $fetch = createFetch({    
    baseURL: "localhost:3000"
})
 
const { data, error } = await $fetch("https://jsonplaceholder.typicode.com/path", {
    body: {
        userId: "1",
        id: 1,
        title: "title",
        completed: true,
    },
});
 
 
baseURL is inferred to "https://jsonplaceholder.typicode.com"
You can also pass a prefix to the createSchema function to prefix all the routes.

Get options
The getOptions function allows you to define additional options that can be passed to the fetch function. This is useful when you want to pass options to the plugins that are not part of the BetterFetchPlugin interface.

fetch.ts

import { createFetch, createSchema, BetterFetchPlugin } from "@better-fetch/fetch";
import { z } from "zod";
 
const plugin = {
    id: "my-plugin",
    name: "My Plugin",
    getOptions() {
        return z.object({
            onUploadProgress: z.function().args(z.object({
                loaded: z.number(),
                total: z.number(),
            })),
        });
    },
} satisfies BetterFetchPlugin;
 
const $fetch = createFetch({
    baseURL: "https://jsonplaceholder.typicode.com",
    plugins: [plugin],
});
 
const { data, error } = await $fetch("https://jsonplaceholder.typicode.com/path", {
    onUploadProgress({
        loaded,
        total,
    }) {
        console.log(`Uploaded ${loaded} of ${total} bytes`);
    },
});
Properties
Prop	Type	Default
id

string
-
name

string
-
description

string
-
version

string
-
hooks

FetchHooks<any>
-
init

(url: string, options?: { cache?: RequestCache | undefined; credentials?: RequestCredentials | undefined; headers?: (HeadersInit & (HeadersInit | CommonHeaders)) | undefined; ... 32 more ...; disableValidation?: boolean | undefined; } | undefined) => Promise<...> | { ...; }
-
schema

Schema
-
getOptions

() => StandardSchemaV1<unknown, unknown>