pipeline {
    agent any
    triggers { githubPush() }
    options {
        timestamps();
        disableConcurrentBuilds()
    }

    environment {
        APP_IMAGE = "myweb:${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                nodejs('NodeJS_16') { // Corrected Node.js version
                    withCredentials([string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_TOKEN')]) {
                        withSonarQubeEnv('sonar-local') {
                            script {
                                def scannerHome = tool 'SonarScanner'
                                sh """
                                    set -e
                                    "${scannerHome}/bin/sonar-scanner" \\
                                        -Dsonar.projectKey=myweb \\
                                        -Dsonar.sources=. \\
                                        -Dsonar.sourceEncoding=UTF-8 \\
                                        -Dsonar.login=\$SONAR_TOKEN
                                """
                            }
                        }
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                echo "Waiting for SonarQube analysis to complete..."
                sleep 15
                waitForQualityGate abortPipeline: true
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    set -e
                    # Ensure Minikube is running before building the image
                    minikube status || minikube start --driver=docker

                    # Point to Minikube's Docker daemon
                    eval $(minikube docker-env)
                    
                    # Build the image inside the Minikube cluster
                    docker build -t myweb:${BUILD_NUMBER} .
                    echo "Built image myweb:${BUILD_NUMBER} directly within the Minikube cluster's Docker daemon."
                '''
            }
        }

        stage('Deploy to Minikube') {
            steps {
                sh '''
                    set -e
                    echo "Deploying to Minikube..."
                    minikube status || minikube start --driver=docker
                    
                    # Update the service manifest first if needed
                    minikube kubectl -- apply -f service.yaml

                    # Set the new image for the deployment, triggering a new rollout
                    minikube kubectl -- set image deployment/web node-app=myweb:${BUILD_NUMBER}

                    # Wait for the new pod to be ready
                    echo "Waiting for pods to be ready..."
                    minikube kubectl -- wait --for=condition=Ready pod -l=app=web --timeout=60s

                    echo "Successfully deployed to Minikube."
                    echo "Access the application using: minikube service web --url"
                '''
            }
        }
    }

    post {
        success {
            echo "Pipeline finished successfully! The application is deployed."
        }
        failure {
            echo "Pipeline failed. Check logs for errors."
        }
        aborted {
            echo "Pipeline was aborted due to a Quality Gate failure."
        }
    }
}
