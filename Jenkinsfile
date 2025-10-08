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
                nodejs('NodeJS_18') {
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
                sh """
                    set -e
                    docker build -t ${APP_IMAGE} .
                    docker tag ${APP_IMAGE} myweb:latest
                """
            }
        }

        stage('Deploy Container') {
            steps {
                sh """
                    set -e
                    if [ "\$(docker ps -aq -f name=myweb)" ]; then
                        docker rm -f myweb
                    fi
                    docker run -d --name myweb -p 80:3000 myweb:latest
                """
            }
        }
    }

    post {
        success {
            echo "Deployed successfully! Visit your EC2 public IP on port 80"
        }
        failure {
            echo "Pipeline failed. Check logs."
        }
        aborted {
            echo "Pipeline was aborted, likely by a Quality Gate timeout."
        }
    }
}
