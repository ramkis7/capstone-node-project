pipeline {
    agent any
    triggers { githubPush() }
    options {
        timestamps();
        disableConcurrentBuilds()
    }

    environment {
        // Renaming DOCKER_IMAGE to APP_IMAGE for clarity, but your original is fine too
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
                // Wrap the analysis steps with the nodejs tool configuration
                // *** REPLACE 'NodeJS_18' with the name you configure in Jenkins Tools ***
                nodejs('NodeJS_18') { 
                    withCredentials([string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_TOKEN')]) {
                        withSonarQubeEnv('sonar-local') {
                            script {
                                def scannerHome = tool 'SonarScanner'
                                sh """
                                    set -e
                                    "${scannerHome}/bin/sonar-scanner" \
                                        -Dsonar.projectKey=myweb \
                                        -Dsonar.sources=. \
                                        -Dsonar.sourceEncoding=UTF-8 \
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
                // Following your class notes for a shorter timeout (3 MIN) is safer, 
                // but 10 MIN is what your log showed, so I'll keep your log's 10 MIN.
                timeout(time: 10, unit: 'MINUTES') { 
                    waitForQualityGate abortPipeline: true
                }
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
                    # Assuming your Node.js app listens on port 3000 inside the container, 
                    # and you map host port 80 to it.
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
        // Added the ABORTED status handler to match the pipeline's end state
        aborted {
            echo "Pipeline was aborted, likely by a Quality Gate timeout."
        }
    }
}
