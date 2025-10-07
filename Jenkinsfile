pipeline {
    agent any
    triggers { githubPush() }

    environment {
        DOCKER_IMAGE = "myweb:${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withCredentials([string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_TOKEN')]) {
                    withSonarQubeEnv('sonar-local') {
                        script {
                            // Use the SonarScanner tool installed automatically by Jenkins
                            def scannerHome = tool 'SonarScanner'
                            sh """
                                set -e
                                "${scannerHome}/bin/sonar-scanner" \
                                    -Dsonar.projectKey=myweb \
                                    -Dsonar.sources=. \
                                    -Dsonar.host.url=http://184.72.190.166:9000 \
                                    -Dsonar.login=$SONAR_TOKEN
                            """
                        }
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    set -e
                    docker build -t ${DOCKER_IMAGE} .
                    docker tag ${DOCKER_IMAGE} myweb:latest
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
    }
}
