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
                // Wait for a short, fixed amount of time to allow SonarQube to process the report.
                // The previous logs showed SonarQube analysis takes ~2 seconds. A 15-second sleep should be sufficient.
                echo "Waiting for SonarQube analysis to complete..."
                sleep 15 // Wait for 15 seconds
        
                // Now, check for the quality gate status. This should now find a completed task.
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
