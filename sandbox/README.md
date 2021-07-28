# Sandbox Examples
The sandbox examples have been pre-configured with a `docker-compose` file for easy setup. Please examine the environment variables in the file prior to running and change the variables where appropriate. For example, if you want to test the Keycloak integration, plugin your configuration values to the `docker-compose.yml` file. 

## Basic Setup
You must have `docker-compose` installed locally. This is not a production grade setup.

To start the services, simply run from this directory.
```shell
docker-compose up --build
```

If you would like the services to run in detached mode, supply the `-d` parameter.

The services are now running under the following:
* [audit-ms-example](http://localhost:3032/explorer)
* [notification-example](http://localhost:3030/explorer)
* [auth-multitenant-example](http://localhost:3000/explorer)
* [in-mail-example](http://localhost:3033/explorer)
* [notification-socket-example](http://localhost:3030/explorer)
* [scheduler-example](http://localhost:3034/explorer)
* [video-conferencing-ms-example](http://localhost:3040/explorer)
* [workflow-ms-example](http://localhost:3031/explorer)
* [Camunda](http://localhost:8080)
* [pgAdmin](http://localhost:5050)
* PostgreSQL - localhost:5432
* Redis - localhost:6739

Credentials for the database and pgAdmin are in the `docker-compose` file or can be overridden with environment variables. An orchestration container creates all of the databases and another runs the service DB migrations for you.

When connecting to PostgreSQL or from within one of the containers, pay attention to the network and service name defined in the `docker-compose` file, since you will connect via the Docker network and service name.

## Local Kubernetes Setup

**This is not a production deployment.**

The steps below are based off a local [microk8s](https://microk8s.io/) setup, but should also work with `minikube`. Please perform the basic `microk8s` setup and ensure that this command is run.

```sh
microk8s enable dashboard dns registry istio
```

If you have issues with the Docker daemon connecting to an insecure registry, please see the microk8s [docs](https://microk8s.io/docs/registry-built-in)

Run the following command to ensure that the base setup is working properly.

```sh
$ microk8s kubectl get all --all-namespaces
NAMESPACE            NAME                                             READY   STATUS      RESTARTS   AGE
istio-system         pod/istio-security-post-install-1.5.1-w6l7l      0/1     Completed   0          25d
istio-system         pod/istio-grafana-post-install-1.5.1-52zx2       0/1     Completed   0          25d
kube-system          pod/calico-kube-controllers-847c8c99d-dktsh      1/1     Running     24         26d
kube-system          pod/hostpath-provisioner-5c65fbdb4f-w9qb7        1/1     Running     22         25d
kube-system          pod/dashboard-metrics-scraper-6c4568dc68-bzp55   1/1     Running     22         25d
kube-system          pod/metrics-server-8bbfb4bdb-l87ww               1/1     Running     22         25d
container-registry   pod/registry-9b57d9df8-b848v                     1/1     Running     22         25d
istio-system         pod/istio-citadel-67658cf6c-rpxl9                1/1     Running     22         25d
istio-system         pod/grafana-d7994566f-nxznh                      1/1     Running     22         25d
kube-system          pod/coredns-86f78bb79c-2vwp6                     1/1     Running     22         25d
istio-system         pod/istio-galley-567478fb94-2lc64                1/1     Running     22         25d
kube-system          pod/kubernetes-dashboard-7ffd448895-hglxc        1/1     Running     22         25d
istio-system         pod/prometheus-9d65f7646-p2j5h                   1/1     Running     22         25d
kube-system          pod/calico-node-zgzfb                            1/1     Running     24         26d
ingress              pod/nginx-ingress-microk8s-controller-s89wr      1/1     Running     4          6d17h
istio-system         pod/istio-telemetry-64d8c69d67-h8lsw             2/2     Running     63         25d
istio-system         pod/istio-tracing-579d7647d9-ls7dt               1/1     Running     26         25d
istio-system         pod/istio-policy-58d8b97644-xl8kg                2/2     Running     62         25d
istio-system         pod/istio-pilot-64d96677f8-j9zhm                 2/2     Running     46         25d
istio-system         pod/istio-sidecar-injector-589988b5d6-tnbxl      1/1     Running     22         25d
istio-system         pod/kiali-77f97f5b4d-4bz8t                       1/1     Running     22         25d
istio-system         pod/istio-egressgateway-756f9bc5b9-mvf87         1/1     Running     22         25d
istio-system         pod/istio-ingressgateway-56bb766b96-m9ngf        1/1     Running     22         25d

NAMESPACE            NAME                                TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)                                                                                                                                      AGE
default              service/kubernetes                  ClusterIP      10.152.183.1     <none>        443/TCP                                                                                                                                      26d
kube-system          service/metrics-server              ClusterIP      10.152.183.11    <none>        443/TCP                                                                                                                                      25d
kube-system          service/kubernetes-dashboard        ClusterIP      10.152.183.62    <none>        443/TCP                                                                                                                                      25d
kube-system          service/dashboard-metrics-scraper   ClusterIP      10.152.183.50    <none>        8000/TCP                                                                                                                                     25d
kube-system          service/kube-dns                    ClusterIP      10.152.183.10    <none>        53/UDP,53/TCP,9153/TCP                                                                                                                       25d
container-registry   service/registry                    NodePort       10.152.183.213   <none>        5000:32000/TCP                                                                                                                               25d
istio-system         service/istio-galley                ClusterIP      10.152.183.132   <none>        443/TCP,15014/TCP,9901/TCP                                                                                                                   25d
istio-system         service/istio-egressgateway         ClusterIP      10.152.183.251   <none>        80/TCP,443/TCP,15443/TCP                                                                                                                     25d
istio-system         service/istio-ingressgateway        LoadBalancer   10.152.183.191   <pending>     15020:30563/TCP,80:31380/TCP,443:31390/TCP,31400:31400/TCP,15029:31830/TCP,15030:30896/TCP,15031:30133/TCP,15032:32717/TCP,15443:30441/TCP   25d
istio-system         service/grafana                     ClusterIP      10.152.183.84    <none>        3000/TCP                                                                                                                                     25d
istio-system         service/kiali                       ClusterIP      10.152.183.247   <none>        20001/TCP                                                                                                                                    25d
istio-system         service/istio-policy                ClusterIP      10.152.183.226   <none>        9091/TCP,15004/TCP,15014/TCP                                                                                                                 25d
istio-system         service/istio-telemetry             ClusterIP      10.152.183.198   <none>        9091/TCP,15004/TCP,15014/TCP,42422/TCP                                                                                                       25d
istio-system         service/istio-pilot                 ClusterIP      10.152.183.121   <none>        15010/TCP,15011/TCP,8080/TCP,15014/TCP                                                                                                       25d
istio-system         service/prometheus                  ClusterIP      10.152.183.204   <none>        9090/TCP                                                                                                                                     25d
istio-system         service/istio-citadel               ClusterIP      10.152.183.5     <none>        8060/TCP,15014/TCP                                                                                                                           25d
istio-system         service/istio-sidecar-injector      ClusterIP      10.152.183.32    <none>        443/TCP,15014/TCP                                                                                                                            25d
istio-system         service/jaeger-query                ClusterIP      10.152.183.106   <none>        16686/TCP                                                                                                                                    25d
istio-system         service/jaeger-collector            ClusterIP      10.152.183.216   <none>        14267/TCP,14268/TCP,14250/TCP                                                                                                                25d
istio-system         service/jaeger-collector-headless   ClusterIP      None             <none>        14250/TCP                                                                                                                                    25d
istio-system         service/jaeger-agent                ClusterIP      None             <none>        5775/UDP,6831/UDP,6832/UDP                                                                                                                   25d
istio-system         service/zipkin                      ClusterIP      10.152.183.41    <none>        9411/TCP                                                                                                                                     25d
istio-system         service/tracing                     ClusterIP      10.152.183.19    <none>        80/TCP                                                                                                                                       25d

NAMESPACE     NAME                                               DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR            AGE
kube-system   daemonset.apps/calico-node                         1         1         1       1            1           kubernetes.io/os=linux   26d
ingress       daemonset.apps/nginx-ingress-microk8s-controller   1         1         1       1            1           <none>                   6d17h

NAMESPACE            NAME                                        READY   UP-TO-DATE   AVAILABLE   AGE
istio-system         deployment.apps/istio-telemetry             1/1     1            1           25d
kube-system          deployment.apps/hostpath-provisioner        1/1     1            1           25d
kube-system          deployment.apps/dashboard-metrics-scraper   1/1     1            1           25d
kube-system          deployment.apps/calico-kube-controllers     1/1     1            1           26d
kube-system          deployment.apps/metrics-server              1/1     1            1           25d
container-registry   deployment.apps/registry                    1/1     1            1           25d
istio-system         deployment.apps/istio-citadel               1/1     1            1           25d
istio-system         deployment.apps/grafana                     1/1     1            1           25d
kube-system          deployment.apps/coredns                     1/1     1            1           25d
istio-system         deployment.apps/istio-galley                1/1     1            1           25d
kube-system          deployment.apps/kubernetes-dashboard        1/1     1            1           25d
istio-system         deployment.apps/istio-policy                1/1     1            1           25d
istio-system         deployment.apps/prometheus                  1/1     1            1           25d
istio-system         deployment.apps/istio-tracing               1/1     1            1           25d
istio-system         deployment.apps/istio-pilot                 1/1     1            1           25d
istio-system         deployment.apps/istio-sidecar-injector      1/1     1            1           25d
istio-system         deployment.apps/kiali                       1/1     1            1           25d
istio-system         deployment.apps/istio-egressgateway         1/1     1            1           25d
istio-system         deployment.apps/istio-ingressgateway        1/1     1            1           25d

NAMESPACE            NAME                                                   DESIRED   CURRENT   READY   AGE
istio-system         replicaset.apps/istio-telemetry-64d8c69d67             1         1         1       25d
kube-system          replicaset.apps/hostpath-provisioner-5c65fbdb4f        1         1         1       25d
kube-system          replicaset.apps/dashboard-metrics-scraper-6c4568dc68   1         1         1       25d
kube-system          replicaset.apps/calico-kube-controllers-847c8c99d      1         1         1       26d
kube-system          replicaset.apps/metrics-server-8bbfb4bdb               1         1         1       25d
container-registry   replicaset.apps/registry-9b57d9df8                     1         1         1       25d
istio-system         replicaset.apps/istio-citadel-67658cf6c                1         1         1       25d
istio-system         replicaset.apps/grafana-d7994566f                      1         1         1       25d
kube-system          replicaset.apps/coredns-86f78bb79c                     1         1         1       25d
istio-system         replicaset.apps/istio-galley-567478fb94                1         1         1       25d
kube-system          replicaset.apps/kubernetes-dashboard-7ffd448895        1         1         1       25d
istio-system         replicaset.apps/istio-policy-58d8b97644                1         1         1       25d
istio-system         replicaset.apps/prometheus-9d65f7646                   1         1         1       25d
istio-system         replicaset.apps/istio-tracing-579d7647d9               1         1         1       25d
istio-system         replicaset.apps/istio-pilot-64d96677f8                 1         1         1       25d
istio-system         replicaset.apps/istio-sidecar-injector-589988b5d6      1         1         1       25d
istio-system         replicaset.apps/kiali-77f97f5b4d                       1         1         1       25d
istio-system         replicaset.apps/istio-egressgateway-756f9bc5b9         1         1         1       25d
istio-system         replicaset.apps/istio-ingressgateway-56bb766b96        1         1         1       25d

NAMESPACE      NAME                                          COMPLETIONS   DURATION   AGE
istio-system   job.batch/istio-security-post-install-1.5.1   1/1           82s        25d
istio-system   job.batch/istio-grafana-post-install-1.5.1    1/1           82s        25d

```

Change your working directory to  `./sandbox`

Run the build script

```sh
chmod +x ./build.sh
./build.sh
```

Now create the `sourceloop-sandbox` namespace.

```sh
$ microk8s kubectl apply -f k8s/manifests/namespaces/
namespace/sourceloop-sandbox created
```

Setup your `microk8s kubectl context`

```sh
$ microk8s kubectl config set-context sourceloop-sandbox \
--user=admin \
--cluster=microk8s-cluster \
--namespace sourceloop-sandbox
Context "sourceloop-sandbox" created.
$ microk8s kubectl config use-context sourceloop-sandbox
Switched to context "sourceloop-sandbox".
```

Now create the rest of the resources

```sh
microk8s kubectl apply -f k8s/manifests/ --recursive
```

To avoid adding a host header to every request, add the following entries to your host file

```sh
127.0.0.1	audit.sourceloop.local
127.0.0.1	auth.sourceloop.local
127.0.0.1	in-mail.sourceloop.local
127.0.0.1	notification.sourceloop.local
127.0.0.1	scheduler.sourceloop.local
127.0.0.1	video.sourceloop.local
127.0.0.1	workflow.sourceloop.local
127.0.0.1	camunda.sourceloop.local
```

You're local setup is now up and running. 

To view the dashboard, run

```sh
$ microk8s dashboard-proxy
```

### Terraform Setup

If you prefer to use the Terraform module, follow the steps below. Terraform 0.14 + is required.

Perform the same steps above to:

* Enable `microk8s` services
* Adding host header entries
* Running the container build script

```sh
cd k8s/tf-sourceloop-sandbox
terraform init
terraform apply
```

See the [readme](./k8s/tf-sourceloop-sandbox/README.md) for more information on the Terraform module.
