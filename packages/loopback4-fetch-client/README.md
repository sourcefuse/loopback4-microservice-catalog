# loopback4-fetch-client

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

A simple extension to send http request using node-fetch in loopback applications.

## Install

```bash
npm install @sourceloop/loopback4-fetch-client
```

## Usage

In order to use this component into your LoopBack application, please follow below steps.

- Add component to application and provide baseUrl and other http initialization details as mentioned below.

```ts
this.component(RequestComponent);

this.bind(RequestBindings.Config).to({
    baseUrl: process.env.BASE_URL,
    json: true
});

this.bind(RequestBindings.FetchProvider).toProvider(fetchClient);
```

- After this, you can just inject the request provider across application.

```ts
@inject.getter(RequestBindings.FetchProvider) requestProvider: Getter <IRequest> ,
```

-- After this you can call send method and pass endpoint path and method name

```ts
const provider = await this.requestProvider();

await provider.send(`/url`, {
    method: 'POST'
})
```

