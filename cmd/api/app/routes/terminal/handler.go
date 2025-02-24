package terminal

import (
  "context"
  "net/http"
  "github.com/gin-gonic/gin"
  "github.com/karmada-io/dashboard/pkg/client"
  "k8s.io/api/core/v1"
  metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// CreateWebTerminal creates a unique ttyd pod for the user
func CreateWebTerminal(c *gin.Context) {
    userUUID := "user-unique-uuid"  // Generate or retrieve this from the user context
    namespace := "karmada-system"
    podName := "ttyd-" + userUUID

    pod := &v1.Pod{
        ObjectMeta: metav1.ObjectMeta{
            Name:      podName,
            Namespace: namespace,
        },
        Spec: v1.PodSpec{
            Containers: []v1.Container{
                {
                    Name:  "ttyd",
                    Image: "tsl0922/ttyd:1.7.4-dev-v1",
                    Ports: []v1.ContainerPort{
                        {
                            ContainerPort: 7681,
                            Name:          "tcp",
                            Protocol:      v1.ProtocolTCP,
                        },
                    },
                },
            },
            RestartPolicy: v1.RestartPolicyAlways,
        },
    }

    // Create the pod in Kubernetes
    kubeClient := client.InClusterClient()  // Use the client to interact with the cluster
    _, err := kubeClient.CoreV1().Pods(namespace).Create(context.TODO(), pod, metav1.CreateOptions{})
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Terminal pod created successfully"})
}

// DeleteWebTerminal deletes the specified ttyd pod for the user
func DeleteWebTerminal(c *gin.Context) {
    podName := c.Param("podName")
    namespace := "karmada-system"

    kubeClient := client.InClusterClient()  // Use the client to interact with the cluster
    err := kubeClient.CoreV1().Pods(namespace).Delete(context.TODO(), podName, metav1.DeleteOptions{})
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Terminal pod deleted successfully"})
}