pipeline {
    agent any

    environment {
        PATH = "/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:${env.PATH}"

        IMAGE_NAME = "sweet-cake"
        IMAGE_TAG = "latest"

        AWS_REGION = "us-east-2"
        AWS_ACCOUNT_ID = "274044236621"
        ECR_REPOSITORY = "sweet-cake"
    }

    stages {

        stage('Checkout') {
            steps {
                echo "Checking out code from GitHub..."
                checkout scm
            }
        }

        stage('Verify Environment') {
            steps {
                sh '''
                    echo "===== Git ====="
                    git --version

                    echo "===== Node ====="
                    node -v

                    echo "===== NPM ====="
                    npm -v

                    echo "===== Docker ====="
                    docker --version

                    echo "===== AWS CLI ====="
                    aws --version
                '''
            }
        }

        

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                sh '''
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                '''
            }
        }

        stage('Login to AWS ECR') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'AWS credentials'
                ]]) {
                    sh '''
                        aws ecr get-login-password --region ${AWS_REGION} | \
                        docker login \
                        --username AWS \
                        --password-stdin \
                        ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                    '''
                }
            }
        }

        stage('Tag Docker Image') {
            steps {
                sh '''
                    docker tag \
                    ${IMAGE_NAME}:${IMAGE_TAG} \
                    ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${IMAGE_TAG}
                '''
            }
        }

        stage('Push Docker Image to ECR') {
            steps {
                sh '''
                    docker push \
                    ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${IMAGE_TAG}
                '''
            }
        }
    }

    post {
        success {
            echo "========================================"
            echo "PIPELINE SUCCESSFUL"
            echo "Application built successfully."
            echo "Docker image pushed to AWS ECR."
            echo "========================================"
        }

        failure {
            echo "========================================"
            echo "PIPELINE FAILED"
            echo "Check the Jenkins Console Output."
            echo "========================================"
        }
    }
}
