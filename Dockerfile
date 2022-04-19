FROM public.ecr.aws/lambda/nodejs:12
COPY package.json package-lock.json ${LAMBDA_TASK_ROOT}/
RUN npm ci --production
COPY . /${LAMBDA_TASK_ROOT}

# Add env variables
ARG DB_USERNAME
ARG DB_PASSWORD
ARG RDS_HOST

ENV DB_USERNAME $DB_USERNAME
ENV DB_PASSWORD $DB_PASSWORD
ENV RDS_HOST $RDS_HOST

CMD [ "lambda.handler" ]