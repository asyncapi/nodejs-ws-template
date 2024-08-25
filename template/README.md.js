const { File } = require('@asyncapi/generator-react-sdk');

function ReadmeFile({ asyncapi }) {
    console.log("Hello", asyncapi.info().description());
    return (
        <File name={'README.md'}>
            {`# ${asyncapi.info().title()}
            
${asyncapi.info().description() || 'Safe'}
`}
        </File>
    );
}

module.exports = ReadmeFile;