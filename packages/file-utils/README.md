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

- add the `file` decorator to the controller method where you want the handle the file -

```ts
@file(getJsonSchema(Parent) as SchemaObject, ['file'], ['.csv'])
data: ParentWithFile,
```

You can read more about the file decorator and it's parameters [here](#file-decorator)

### File Decorator

This decorator is designed to handle file uploads in a `multipart/form-data` request. It provides a structured way to manage multiple fields, including file fields, in your request body.

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

By default, the files are stored in memory, but the package also provides an s3 based storage engine as well, it can be used in two ways -

- if you want to use this strategy for every request, just bind a storage provider on `FileUtilBindings.MulterStorage` key

```ts
this.bind(FileUtilBindings.MulterStorage).toProvider(MulterStorageProvider);
```

You can refer the default implementation [here](./src/services/multer-storage.provider.ts).

- if you want to use this strategy for particular requests, you can provide the storage class and it's config with the `@file` decorator -

```ts
  @post('/parents/s3')
  @response(200, {
    description: 'Parent model instance',
    content: {'application/json': {schema: getModelSchemaRef(Parent)}},
  })
  async createS3(
    @file(getJsonSchema(Parent) as SchemaObject, ['file'], ['.csv'], {
      storageClass: MulterS3Storage,
      options: {
        bucket: process.env.AWS_S3_BUCKET ?? '',
      },
    })
    data: ParentWithFile,
  ): Promise<void> {
    this.receiverStub.receive(data);
  }
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

### Limits Configurations

You can configure the multer instance by binding the multer limits configuration on the `FileUtilBindings.MulterLimits` key -

```ts
this.bind(FileUtilBindings.MulterLimits).to({
  fileSize: FIVE * MB, // 5 MB
  files: 1,
});
```

## Contributing

Contributions are welcome! Please refer to the [contribution guidelines](../../DEVELOPING.md) for more information.

## License

This package is [MIT licensed](../../LICENSE).
