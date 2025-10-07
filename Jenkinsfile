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
                // Inject SONAR_TOKEN from Jenkins credentials
                withCredentials([string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_TOKEN')]) {
                    withSonarQubeEnv('sonar-local') {
                        script {
                            // Use multiline shell string to avoid Groovy secret interpolation issues
                            sh '''
                                ${SONAR_SCANNER_HOME}/bin/sonar-scanner \
                                    -Dsonar.projectKey=myweb \
                                    -Dsonar.sources=. \
                                    -Dsonar.host.url=http://184.72.190.166:9000 \
                                    -Dsonar.login=$SONAR_TOKEN
                            '''
                        }
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                // Wait up to 5 minutes for SonarQube Quality Gate
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE} ."
                sh "docker tag ${DOCKER_IMAGE} myweb:latest"
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                    if [ "$(docker ps -aq -f name=myweb)" ]; then
                        docker rm -f myweb
                    fi
                    docker run -d --name myweb -p 80:3000 myweb:latest
                '''
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
