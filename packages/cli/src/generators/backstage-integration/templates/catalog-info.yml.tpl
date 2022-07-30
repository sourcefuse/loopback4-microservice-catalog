apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: <%= name %>
  description: <%= description %>
  annotations:
    github.com/project-slug: <%= owner + '/' + name %>
    backstage.io/techdocs-ref: dir:../
spec:
  type: website
  lifecycle: experimental
  owner: <%= owner %>
