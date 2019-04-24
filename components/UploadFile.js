import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { FILES_BY_USER } from "./Files";

const UPLOAD_FILE_MUTATION = gql`
  mutation singleUpload($file: Upload!) {
    singleUpload(file: $file) {
      id
      filename
      duration
      uploadedAt
      textTitle
      state
    }
  }
`;

class UploadFile extends Component {
  state = {
    file: null
  };

  handleChange = e => {
    const files = e.target.files;
    const file = files[0];
    this.setState({ file });
  };
  /* update = (cache, payload) => {
    // manually update the cache on the client, so it matches the server
    // 1. Read the cache for the files we want
    const data = cache.readQuery({ query: FILES_BY_USER });
    //console.log(data.filesByUser, payload);
    // 2. Filter the deleted file out of the page
    data.filesByUser = data.filesByUser.concat(payload.data.singleUpload);
    // 3. Put the files back!
    cache.writeQuery({ query: FILES_BY_USER, data });
  }; */

  render() {
    return (
      <Mutation mutation={UPLOAD_FILE_MUTATION} variables={this.state}>
        {(singleUpload, { loading, error }) => (
          <Form
            data-test="form"
            onSubmit={async e => {
              // Stop the form from submitting
              e.preventDefault();
              // call the mutation
              const res = await singleUpload();
              Router.push({
                pathname: "/text",
                query: {
                  id: res.data.singleUpload.id
                  //duration: res.data.singleUpload.duration
                }
              });
            }}
          >
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="file">
                Helisalvestis
                <input
                  type="file"
                  accept="audio/*"
                  id="file"
                  name="file"
                  placeholder="Lae helisalvestis ülesse (kuni 100 MB)"
                  required
                  onChange={this.handleChange}
                />
              </label>

              <button type="submit">Lae ülesse</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default UploadFile;
export { UPLOAD_FILE_MUTATION };
