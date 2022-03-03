FROM public.ecr.aws/lambda/nodejs:12
COPY package.json package-lock.json ${LAMBDA_TASK_ROOT}/
RUN npm ci --production
COPY . /${LAMBDA_TASK_ROOT}
CMD [ "app.handler" ]