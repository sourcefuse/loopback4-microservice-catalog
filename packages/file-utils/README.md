# File Utils

This package provides utilities for adding file upload and validations in LoopBack 4 microservices.

## Installation

To install the package, run the following command:

```shell
npm install @sourceloop/file-utils
```

## Usage

- bind the component and add the require bindings.

```ts
this.bind(AWSS3Bindings.Config).to({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
} as AwsS3Config);

this.component(FileUtilComponent);
```

You have two ways to accept multipart requests in a controller -

- add the `multipartRequestBody` decorator to the controller method where you want to accept a multipart request body with/without files -

```ts
  @post(`/parents/no-model-metadata`)
  @response(200, {
    description: 'Parent without config model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(ParentWithConfig)},
    },
  })
  async createWithOutModelConfig(
    @multipartRequestBody(ParentWithConfig)
    data: ParentWithModelConfig,
  ): Promise<void> {
    ...
  }
```

You can read more about this decorator [here](#multipart-request-decorator)

- add the `file` decorator to the controller method where you want the handle the file -

```ts
@file(getJsonSchema(Parent) as SchemaObject, ['file'], ['.csv'])
data: ParentWithFile,
```

You can read more about the file decorator and it's parameters [here](#file-decorator)

### Multipart Request Decorator

This decorator allows a `multipart/form-data` request body, with as many fields and files as we like. It requires you to define a model for request, and if any field is of file type, you need to decorate it with `@fileProperty` -

```ts
@model()
export class ParentWithConfig extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  // file field
  @fileProperty({
    type: 'object',
    // you can configure individual fields here
    validators: [FileTypeValidator],
    extensions: ['.png', '.txt'],
  })
  file: Express.Multer.File;

  constructor(data?: Partial<ParentWithConfig>) {
    super(data);
  }
}
```

### File Decorator

This decorator is designed to handle single file uploads in a `multipart/form-data` request. It provides a structured way to manage multiple fields, including file fields, in your request body.

#### Parameters

- **schema** (`SchemaObject`):

  - The schema object for the request body. It is useful in cases where you have multiple fields and you want to handle this data in a structured way. For example, if your request has a file field and a name field, you can define a schema object with these fields and pass it to the decorator. The file field will be marked as binary in the schema.

- **fileFields** (`string[]`):

  - The fields in the schema that represent file uploads. So as per the above example, you can pass `['file']` to this parameter. This will mark the file field as binary in the schema.

- **allowedExtensions** (`string[]`):

  - The allowed file extensions for the uploaded files.

- **storageOptions** (`IFileStorageOptions<T>`):
  - The options for file storage. This supports any multer storage engine class. By default, this uses in-memory storage, and the package also provides an S3 storage engine.

#### S3 Storage Engine

By default, the files are stored in memory, but the package also provides an s3 based storage engine as well, to use it, you need to install the `loopback4-s3` package - `npm i loopback4-s3` and then you can provide it in the configuration property of the `@fileProperty` or `@file` decorators. You also need to bind it globally as follows -

```ts
import {MulterS3Storage} from '@sourceloop/file-utils/s3';
...
// inside component/application constructor
this.service(MulterS3Storage);
```

### File Validations

The package provides two validators by default -

- `FileTypeValidator` - validates the type of the file as per configurations
- `FileNameValidator` - validates the name of the file, to avoid certain special characters in the name

You can write your own custom validators and register them using the `@fileValidator` decorator, every validator must implement the `IFileValidator` interface -

```ts
@fileValidator()
export class FileSizeValidator implements IFileValidator {
  ...
}
```

### ClamAV

The package provides a validator based on ClamAV, to use it, you need to install the `clamscan` package - `npm i clamscan` and then bind the validators in your application.ts as -

```ts
this.service(ClamAVValidator);
```

### Limits Configurations

You can configure the multer instance by binding an instance of `IFileLimitsGetter` on the `FileUtilBindings.LimitProvider` key -

```ts
this.bind(FileUtilBindings.LimitProvider).to({
  get() {
    // this is the default limits in the package
    fileSize: FIVE * MB, // 5 MB
    files: 1,
  }
});


// OR you can use a class or any other type of binding as long as it returns
// an instance of `IFileLimitsGetter-
this.bind(FileUtilBindings.LimitProvider).toClass(MulterConfigService);
```

You would also need to update the model decorator with following config in your model file -

```ts
@model({
  settings: {multer: {limitsProvider: true}},
})
export class TestModel extends Entity {}
```

## Contributing

Contributions are welcome! Please refer to the [contribution guidelines](../../DEVELOPING.md) for more information.

## License

This package is [MIT licensed](../../LICENSE).
