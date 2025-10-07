pipeline {
    agent any
    triggers { githubPush() }

    environment {
        DOCKER_IMAGE = "myweb:${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') { steps { checkout scm } }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-local') {
                    script {
                        def scannerHome = tool 'SonarScanner'
                        sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=myweb -Dsonar.sources=. -Dsonar.host.url=http://localhost:9000 -Dsonar.login=${SONAR_TOKEN}"
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps { timeout(time: 3, unit: 'MINUTES') { waitForQualityGate abortPipeline: true } }
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
                if [ "$(docker ps -aq -f name=myweb)" ]; then docker rm -f myweb; fi
                docker run -d --name myweb -p 80:3000 myweb:latest
                '''
            }
        }
    }

    post {
        success { echo "Deployed. Visit EC2 public IP on port 80" }
        failure { echo "Pipeline failed. Check logs." }
    }
}

