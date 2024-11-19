pipeline {
    agent any

    environment {
        IMAGE = "saknouche/todoapp:version-${env.BUILD_ID}"
        SCANNER_HOME = tool 'sonar-scanner'
    }
    
    tools {
        jdk 'jdk17'
        nodejs 'node18'
    }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout from Git') {
            steps {
                git branch: 'main', url: 'https://github.com/saknouche/todoapp.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    sh '''${SCANNER_HOME}/bin/sonar-scanner -Dsonar.projectName=todoapp \
                    -Dsonar.projectKey=todoapp'''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                script {
                    waitForQualityGate abortPipeline: false, credentialsId: 'Sonar-token'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('OWASP FS Scan') {
            steps {
                dependencyCheck additionalArguments: '--scan ./ --disableYarnAudit --disableNodeAudit', odcInstallation: 'DP-Check'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }

        stage('Trivy FS Scan') {
            steps {
                sh 'trivy fs . --scanners vuln > trivyfs.txt'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    img = docker.build("${IMAGE}", '.')
                }
            }
        }

        stage('Run') {
            steps {
                script {
                    img.withRun("--name run-${BUILD_ID} -p 3000:3000") { c ->
                        sh 'docker ps'
                        sh 'netstat -ntaup'
                        sh 'sleep 30s'
                        sh 'curl 127.0.0.1:3000'
                        sh 'docker ps'
                    }
                }
            }
        }

        stage('Trivy Image Scan') {
            steps {
                sh "trivy image ${IMAGE} > trivyimage.txt"
            }
        }

        stage('Push to Registry') {
            steps {
                script {
                    docker.withRegistry('', 'docker') {
                        img.push('latest')
                        img.push()
                    }
                }
            }
        }
        
        stage('Deploy to kubernets'){
            steps{
                script{
                    dir('kubernetes') {
                        withKubeConfig(caCertificate: '', clusterName: '', contextName: '', credentialsId: 'k8s', namespace: '', restrictKubeConfigAccess: false, serverUrl: '') {
                                sh 'kubectl apply -f deployment.yml'
                                sh 'kubectl apply -f service.yml'
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            emailext attachLog: true,
                subject: "'${currentBuild.result}'",
                body: "Project: ${env.JOB_NAME}<br/>" +
                      "Build Number: ${env.BUILD_NUMBER}<br/>" +
                      "URL: ${env.BUILD_URL}<br/>",
                to: 'real.soufiane90@gmail.com',
                attachmentsPattern: 'trivyfs.txt,trivyimage.txt'
        }
    }
}
